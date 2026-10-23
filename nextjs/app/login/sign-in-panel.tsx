'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getSiteUrl } from '@/lib/supabase/env'

type Mode = 'sign-in' | 'sign-up'
type PendingAction = 'google' | 'email' | null

const ERROR_MESSAGES: Record<string, string> = {
  auth: 'That sign-in link did not work. Try again.',
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: 'Email or password is wrong. Check both fields and try again.',
  email_not_confirmed: 'Confirm your email first. The link is in your inbox.',
  user_already_exists: 'That email already has an account. Sign in instead.',
  email_exists: 'That email already has an account. Sign in instead.',
  weak_password: 'Pick a stronger password. Use at least 6 characters.',
  over_email_send_rate_limit: 'Too many emails sent. Wait a minute, then try again.',
  signup_disabled: 'Email sign-up is turned off right now. Use Google instead.',
}

const LABEL_CLASS = 'text-xs font-semibold tracking-[0.1px] text-ink-soft'

const INPUT_CLASS =
  'h-[52px] w-full rounded-[14px] border border-hairline-strong bg-card px-4 text-sm text-charcoal placeholder:text-[#6b7682] transition-colors focus:border-forest-deep focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-deep'

const PRIMARY_BUTTON_CLASS =
  'flex h-[52px] w-full items-center justify-center gap-3 rounded-[15px] bg-charcoal px-5 text-[14.5px] font-semibold text-card transition-colors hover:bg-[#1c222a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-deep disabled:cursor-not-allowed disabled:opacity-70'

const GHOST_BUTTON_CLASS =
  'flex h-[52px] w-full items-center justify-center gap-3 rounded-[15px] border border-hairline-strong bg-card px-5 text-[14.5px] font-semibold text-charcoal transition-colors hover:bg-card-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-deep disabled:cursor-not-allowed disabled:opacity-70'

export function SignInPanel() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next')
  const errorCode = searchParams.get('error')
  const [mode, setMode] = useState<Mode>('sign-in')
  const [pending, setPending] = useState<PendingAction>(null)
  const [failure, setFailure] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [urlErrorDismissed, setUrlErrorDismissed] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const focusHeading = useRef(false)

  const queryMessage = errorCode ? ERROR_MESSAGES[errorCode] : null
  const message = failure ?? (urlErrorDismissed ? null : queryMessage)
  const isBusy = pending !== null

  useEffect(() => {
    if (!focusHeading.current) return
    focusHeading.current = false
    headingRef.current?.focus()
  }, [mode])

  function changeMode(nextMode: Mode) {
    if (nextMode === mode) return

    focusHeading.current = true
    setMode(nextMode)
    setFailure(null)
    setNotice(null)
    setShowPassword(false)
    setUrlErrorDismissed(true)
  }

  function getCallbackUrl() {
    const callbackUrl = new URL(
      '/auth/callback',
      getSiteUrl(window.location.origin)
    )
    if (next) callbackUrl.searchParams.set('next', next)
    return callbackUrl.toString()
  }

  function getDestination() {
    try {
      const url = new URL(next ?? '/', window.location.origin)
      if (url.origin !== window.location.origin) return '/'
      return `${url.pathname}${url.search}${url.hash}`
    } catch {
      return '/'
    }
  }

  function finishSignIn() {
    router.replace(getDestination())
    router.refresh()
  }

  async function handleGoogleSignIn() {
    setPending('google')
    setFailure(null)
    setNotice(null)

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getCallbackUrl(),
      },
    })

    if (error) {
      console.error('Google sign-in failed:', error.message)
      setFailure('Google sign-in is not available right now. Try again.')
      setPending(null)
    }
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFailure(null)
    setNotice(null)
    setPending('email')

    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '')
    const fullName = String(form.get('fullName') ?? '').trim()
    const supabase = createClient()

    if (mode === 'sign-up') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getCallbackUrl(),
          data: fullName ? { full_name: fullName } : undefined,
        },
      })

      if (error) {
        setFailure(describeAuthError(error))
        setPending(null)
        return
      }

      if (data.session) {
        finishSignIn()
        return
      }

      setNotice(
        `We sent a confirmation link to ${email}. Open it to finish creating your account.`
      )
      setPending(null)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setFailure(describeAuthError(error))
      setPending(null)
      return
    }

    finishSignIn()
  }

  return (
    <div className="flex w-full flex-col gap-5">
      {mode === 'sign-up' ? (
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-lime-pop px-2.75 py-1.5 text-[11px] font-semibold text-charcoal">
          <GraduationCapIcon />
          Student account
        </span>
      ) : null}

      <div className="flex flex-col gap-2">
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="font-head text-[30px] font-semibold leading-[1.12] tracking-[-0.9px] text-charcoal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest-deep"
        >
          {mode === 'sign-up' ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="text-[13px] leading-normal text-ink-soft">
          {mode === 'sign-up'
            ? 'Use your campus email so orders, tokens, and receipts follow you to any device.'
            : 'Sign in to check out, and keep your pickup token with your account.'}
        </p>
      </div>

      {message ? (
        <p
          role="alert"
          className="rounded-[14px] border border-danger/30 bg-[#fbedec] px-4 py-3 text-[13px] leading-relaxed text-[#9b2c22]"
        >
          {message}
        </p>
      ) : null}

      {notice ? (
        <p
          role="status"
          className="rounded-[14px] border border-forest/30 bg-mint px-4 py-3 text-[13px] leading-relaxed text-forest-deep"
        >
          {notice}
        </p>
      ) : null}

      <form onSubmit={handleEmailSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-3.5">
          {mode === 'sign-up' ? (
            <div className="flex flex-col gap-1.75">
              <label htmlFor="fullName" className={LABEL_CLASS}>
                Full name{' '}
                <span className="font-normal text-fog">(optional)</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="Maya Prasetyo"
                className={INPUT_CLASS}
              />
            </div>
          ) : null}

          <div className="flex flex-col gap-1.75">
            <label htmlFor="email" className={LABEL_CLASS}>
              Campus email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              placeholder="maya.prasetyo@ui.ac.id"
              className={INPUT_CLASS}
            />
          </div>

          <div className="flex flex-col gap-1.75">
            <label htmlFor="password" className={LABEL_CLASS}>
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete={
                  mode === 'sign-up' ? 'new-password' : 'current-password'
                }
                aria-describedby={
                  mode === 'sign-up' ? 'password-hint' : undefined
                }
                placeholder={
                  mode === 'sign-up' ? 'At least 6 characters' : 'Your password'
                }
                className={`${INPUT_CLASS} pr-16`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-pressed={showPassword}
                aria-controls="password"
                className="absolute inset-y-0 right-0 flex w-16 items-center justify-center rounded-r-[14px] text-xs font-semibold text-forest-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-deep"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {mode === 'sign-up' ? (
              <p id="password-hint" className="text-[11.5px] text-fog">
                At least 6 characters. Longer is better.
              </p>
            ) : null}
          </div>
        </div>

        <button
          type="submit"
          disabled={isBusy}
          aria-busy={pending === 'email'}
          className={PRIMARY_BUTTON_CLASS}
        >
          {pending === 'email' ? (
            <span
              aria-hidden="true"
              className="size-5 animate-spin rounded-full border-2 border-card/30 border-t-card motion-reduce:animate-none"
            />
          ) : null}
          {pending === 'email'
            ? mode === 'sign-up'
              ? 'Creating account…'
              : 'Signing in…'
            : mode === 'sign-up'
              ? 'Create account'
              : 'Sign in'}
        </button>
      </form>

      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-hairline" />
        <span className="text-[11px] text-fog">or</span>
        <span className="h-px flex-1 bg-hairline" />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isBusy}
        aria-busy={pending === 'google'}
        className={GHOST_BUTTON_CLASS}
      >
        {pending === 'google' ? (
          <span
            aria-hidden="true"
            className="size-5 animate-spin rounded-full border-2 border-charcoal/25 border-t-charcoal motion-reduce:animate-none"
          />
        ) : (
          <GoogleIcon />
        )}
        {pending === 'google'
          ? 'Opening Google…'
          : mode === 'sign-up'
            ? 'Sign up with Google'
            : 'Continue with Google'}
      </button>

      <div className="flex min-h-11 flex-wrap items-center justify-center gap-x-1 text-[12.5px]">
        <span className="text-fog">
          {mode === 'sign-up' ? 'Already have an account?' : 'New to Vinix?'}
        </span>
        <button
          type="button"
          onClick={() =>
            changeMode(mode === 'sign-up' ? 'sign-in' : 'sign-up')
          }
          disabled={isBusy}
          className="inline-flex min-h-11 items-center px-1 text-[12.5px] font-semibold text-forest-deep underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-deep disabled:cursor-not-allowed disabled:opacity-70"
        >
          {mode === 'sign-up' ? 'Sign in' : 'Create an account'}
        </button>
      </div>
    </div>
  )
}

function describeAuthError(error: { message: string; code?: string }) {
  if (error.code && AUTH_ERROR_MESSAGES[error.code]) {
    return AUTH_ERROR_MESSAGES[error.code]
  }

  const normalised = error.message.toLowerCase()

  if (normalised.includes('invalid login credentials')) {
    return AUTH_ERROR_MESSAGES.invalid_credentials
  }
  if (normalised.includes('email not confirmed')) {
    return AUTH_ERROR_MESSAGES.email_not_confirmed
  }
  if (normalised.includes('already registered')) {
    return AUTH_ERROR_MESSAGES.user_already_exists
  }

  return error.message
}

function GraduationCapIcon() {
  return (
    <svg
      aria-hidden="true"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  )
}

import type { Metadata } from 'next'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getSessionClaims } from '@/lib/supabase/auth'
import { signOut } from './auth/actions'

export const metadata: Metadata = {
  title: 'Vinix Canteen',
  description: 'Campus canteen pre-order and pickup tokens.',
}

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-4 py-6 sm:px-6 sm:py-10">
      <header className="flex items-center gap-3.5">
        <span
          aria-hidden="true"
          className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-strong font-extrabold text-canvas"
        >
          VC
        </span>
        <div>
          <p className="text-base font-bold tracking-tight text-white">
            Vinix Canteen
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.05em] text-muted">
            Campus pre-order
          </p>
        </div>
      </header>

      <div className="flex flex-1 items-center py-10">
        <Suspense fallback={<SessionCardFallback />}>
          <SessionCard />
        </Suspense>
      </div>
    </main>
  )
}

async function SessionCard() {
  const claims = await getSessionClaims()

  if (!claims) {
    redirect('/login')
  }

  const email = claims.email ?? 'your account'
  const metadata = claims.user_metadata ?? {}
  const appMetadata = claims.app_metadata ?? {}
  const provider =
    typeof appMetadata.provider === 'string' ? appMetadata.provider : null
  const signInMethod =
    provider === 'google' ? 'Google' : provider === 'email' ? 'Email' : 'Email or Google'
  const fullName =
    typeof metadata.full_name === 'string'
      ? metadata.full_name
      : typeof metadata.name === 'string'
        ? metadata.name
        : null
  const displayName = fullName ?? email
  const initials = getInitials(displayName)

  return (
    <section
      aria-labelledby="session-heading"
      className="w-full rounded-3xl border border-white/10 bg-surface p-6 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.7)] sm:p-10"
    >
      <div className="flex flex-wrap items-center gap-4">
        <span
          aria-hidden="true"
          className="flex size-14 items-center justify-center rounded-2xl bg-brand/15 text-lg font-bold text-brand"
        >
          {initials}
        </span>
        <div className="min-w-0">
          <h1
            id="session-heading"
            className="truncate text-2xl font-extrabold tracking-tight text-white"
          >
            {displayName}
          </h1>
          <p className="truncate text-sm text-muted">{email}</p>
        </div>
      </div>

      <dl className="mt-8 divide-y divide-white/10 border-y border-white/10 text-sm">
        <div className="flex items-center justify-between gap-4 py-3.5">
          <dt className="text-muted">Sign-in method</dt>
          <dd className="font-medium text-ink">{signInMethod}</dd>
        </div>
        <div className="flex items-center justify-between gap-4 py-3.5">
          <dt className="text-muted">Session status</dt>
          <dd className="flex items-center gap-2 font-medium text-ink">
            <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
            Verified
          </dd>
        </div>
      </dl>

      <form action={signOut} className="mt-8">
        <button
          type="submit"
          className="flex h-11 items-center justify-center rounded-xl border border-white/15 px-5 text-sm font-semibold text-ink transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Sign out
        </button>
      </form>
    </section>
  )
}

function SessionCardFallback() {
  return (
    <div
      aria-hidden="true"
      className="w-full rounded-3xl border border-white/10 bg-surface p-6 sm:p-10"
    >
      <div className="flex items-center gap-4">
        <div className="size-14 rounded-2xl bg-white/5" />
        <div className="space-y-2">
          <div className="h-6 w-40 rounded bg-white/5" />
          <div className="h-4 w-56 rounded bg-white/5" />
        </div>
      </div>
      <div className="mt-8 h-24 rounded-xl bg-white/5" />
    </div>
  )
}

function getInitials(name: string) {
  const words = name
    .replace(/@.*$/, '')
    .split(/[\s._-]+/)
    .filter(Boolean)

  if (words.length === 0) return 'VC'

  const first = words[0]?.[0] ?? ''
  const second = words.length > 1 ? (words[words.length - 1]?.[0] ?? '') : ''

  return `${first}${second}`.toUpperCase()
}

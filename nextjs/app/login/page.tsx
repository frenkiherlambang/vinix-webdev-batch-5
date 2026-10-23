import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { Geist, Inter } from 'next/font/google'
import { SignInPanel } from './sign-in-panel'

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Sign in · Vinix Canteen',
  description: 'Sign in with Google or email to pre-order canteen meals.',
}

export default function LoginPage() {
  return (
    <div
      className={`${geist.variable} ${inter.variable} min-h-dvh bg-paper font-body text-charcoal [color-scheme:light]`}
    >
      <main className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col px-5 pb-8 pt-6 sm:pt-10">
        <header className="flex items-center gap-3">
          <Link
            href="/"
            aria-label="Vinix Canteen home"
            className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-card shadow-[0_1px_3px_rgba(11,18,32,0.06)] transition-colors hover:bg-card-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-deep"
          >
            <span className="font-head text-[13px] font-bold tracking-[-0.3px] text-charcoal">
              VC
            </span>
          </Link>

          <div className="min-w-0 flex-1">
            <p className="truncate font-head text-[19px] font-semibold leading-tight tracking-[-0.2px] text-charcoal">
              Vinix Canteen
            </p>
            <p className="truncate text-xs text-fog">Campus pre-order account</p>
          </div>

          <details className="relative shrink-0">
            <summary
              aria-label="Sign-in help"
              className="flex size-[42px] cursor-pointer list-none items-center justify-center rounded-full bg-card text-charcoal shadow-[0_1px_3px_rgba(11,18,32,0.06)] transition-colors hover:bg-card-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-deep [&::-webkit-details-marker]:hidden"
            >
              <HelpCircleIcon />
            </summary>
            <div className="absolute right-0 top-[calc(100%+8px)] z-10 w-64 rounded-2xl border border-hairline bg-card p-4 shadow-[0_12px_30px_rgba(11,18,32,0.12)]">
              <p className="text-xs font-semibold text-charcoal">Signing in</p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
                Use the campus email tied to your canteen orders. If you no longer
                have access to that inbox, ask the canteen desk to update it.
              </p>
            </div>
          </details>
        </header>

        <section className="flex flex-1 flex-col pb-4 pt-8 lg:justify-center">
          <Suspense fallback={<SignInPanelFallback />}>
            <SignInPanel />
          </Suspense>
        </section>
      </main>
    </div>
  )
}

function SignInPanelFallback() {
  return (
    <div aria-hidden="true" className="w-full">
      <div className="h-9 w-44 rounded-md bg-charcoal/10" />
      <div className="mt-3 h-4 w-full max-w-[320px] rounded bg-charcoal/10" />
      <div className="mt-8 flex flex-col gap-3.5">
        <div className="h-[52px] rounded-[14px] bg-card" />
        <div className="h-[52px] rounded-[14px] bg-card" />
      </div>
      <div className="mt-5 h-[52px] rounded-[15px] bg-charcoal/90" />
      <div className="mt-5 h-[52px] rounded-[15px] bg-card" />
    </div>
  )
}

function HelpCircleIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  )
}

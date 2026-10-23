import type { Metadata } from 'next'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { signOut } from '@/app/auth/actions'
import { CheckIcon } from '@/components/icons'
import { PageHeader } from '@/components/page-header'
import { getSessionClaims } from '@/lib/supabase/auth'
import { getDisplayName, getInitial, getSignInMethod } from '@/lib/user'

export const metadata: Metadata = {
  title: 'Profile · Vinix Canteen',
  description: 'Your Vinix Canteen account and session.',
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  )
}

async function ProfileContent() {
  const claims = await getSessionClaims()

  if (!claims) {
    redirect('/login')
  }

  const email = claims.email ?? 'your account'
  const displayName = getDisplayName(claims)
  const signInMethod = getSignInMethod(claims)

  return (
    <>
      <PageHeader title="Profile" description="Your Vinix Canteen account." />

      <section
        aria-labelledby="account-heading"
        className="rounded-[18px] border border-hairline bg-card p-5 shadow-[0_1px_3px_rgba(11,18,32,0.06)]"
      >
        <h2 id="account-heading" className="sr-only">
          Account
        </h2>

        <div className="flex items-center gap-3.5">
          <span
            aria-hidden="true"
            className="flex size-14 shrink-0 items-center justify-center rounded-full bg-mint font-head text-lg font-semibold text-forest-deep"
          >
            {getInitial(displayName)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-head text-lg font-semibold text-charcoal">
              {displayName}
            </p>
            <p className="truncate text-sm text-fog">{email}</p>
          </div>
        </div>

        <dl className="mt-6 divide-y divide-hairline border-y border-hairline text-sm">
          <div className="flex items-center justify-between gap-4 py-3.5">
            <dt className="text-fog">Sign-in method</dt>
            <dd className="font-medium text-charcoal">{signInMethod}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3.5">
            <dt className="text-fog">Session status</dt>
            <dd className="flex items-center gap-1.5 font-medium text-forest-deep">
              <CheckIcon className="size-4" />
              Verified
            </dd>
          </div>
        </dl>

        <form action={signOut} className="mt-6">
          <button
            type="submit"
            className="flex h-[52px] w-full items-center justify-center rounded-[15px] border border-hairline-strong bg-card text-[14.5px] font-semibold text-charcoal transition-colors hover:bg-card-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-deep"
          >
            Sign out
          </button>
        </form>
      </section>
    </>
  )
}

function ProfileSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading profile</span>

      <div className="pb-6 pt-1" aria-hidden="true">
        <div className="h-7 w-28 rounded bg-card" />
        <div className="mt-2 h-4 w-52 rounded bg-card" />
      </div>

      <div
        className="rounded-[18px] border border-hairline bg-card p-5"
        aria-hidden="true"
      >
        <div className="flex items-center gap-3.5">
          <div className="size-14 shrink-0 rounded-full bg-card-soft" />
          <div className="space-y-2">
            <div className="h-5 w-40 rounded bg-card-soft" />
            <div className="h-4 w-52 rounded bg-card-soft" />
          </div>
        </div>
        <div className="mt-6 h-24 rounded bg-card-soft" />
      </div>
    </div>
  )
}

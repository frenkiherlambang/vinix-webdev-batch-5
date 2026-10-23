import type { Metadata } from 'next'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { DashboardScreen } from '@/components/dashboard-screen'
import { DashboardSkeleton } from '@/components/dashboard-skeleton'
import { getSessionClaims } from '@/lib/supabase/auth'
import { getDisplayName, getInitial } from '@/lib/user'

export const metadata: Metadata = {
  title: 'Canteen · Vinix',
  description:
    'Find an open canteen stall, check the wait, and order between classes.',
}

export default function Home() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  )
}

async function DashboardContent() {
  const claims = await getSessionClaims()

  if (!claims) {
    redirect('/login')
  }

  return <DashboardScreen initial={getInitial(getDisplayName(claims))} />
}

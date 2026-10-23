import type { ReactNode } from 'react'
import { BottomNav } from '@/components/bottom-nav'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-light min-h-dvh bg-paper font-body text-charcoal">
      <div className="mx-auto flex min-h-dvh w-full max-w-[760px] flex-col px-5 pb-32 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-8">
        {children}
      </div>
      <BottomNav />
    </div>
  )
}

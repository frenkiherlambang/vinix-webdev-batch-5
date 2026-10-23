import { BottomNav } from '@/components/bottom-nav'
import { DashboardScreen } from '@/components/dashboard-screen'

export default function PreviewPage() {
  return (
    <div className="app-light min-h-dvh bg-paper font-body text-charcoal">
      <div className="mx-auto flex min-h-dvh w-full max-w-[760px] flex-col px-5 pb-32 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-8">
        <DashboardScreen initial="A" />
      </div>
      <BottomNav />
    </div>
  )
}

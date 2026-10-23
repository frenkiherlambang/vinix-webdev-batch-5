import type { Metadata } from 'next'
import { EmptyState } from '@/components/empty-state'
import { TrayIcon } from '@/components/icons'
import { PageHeader } from '@/components/page-header'

export const metadata: Metadata = {
  title: 'Tray · Vinix Canteen',
  description: 'Review the dishes you picked before paying.',
}

export default function TrayPage() {
  return (
    <>
      <PageHeader
        title="Tray"
        description="Review your picks before you pay."
      />
      <EmptyState
        icon={<TrayIcon className="size-6" />}
        title="Your tray is empty"
        description="Add dishes from a stall and they will wait here until you pay."
      />
    </>
  )
}

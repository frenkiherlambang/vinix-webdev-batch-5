import type { Metadata } from 'next'
import { EmptyState } from '@/components/empty-state'
import { ReceiptIcon } from '@/components/icons'
import { PageHeader } from '@/components/page-header'

export const metadata: Metadata = {
  title: 'Orders · Vinix Canteen',
  description: 'Check your paid orders and pickup tokens.',
}

export default function OrdersPage() {
  return (
    <>
      <PageHeader
        title="Orders"
        description="Paid orders and pickup tokens live here."
      />
      <EmptyState
        icon={<ReceiptIcon className="size-6" />}
        title="No orders yet"
        description="When you pay for a tray, your pickup token shows up here."
      />
    </>
  )
}

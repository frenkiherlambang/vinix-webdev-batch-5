import Link from 'next/link'
import type { ReactNode } from 'react'

type EmptyStateProps = {
  icon: ReactNode
  title: string
  description: string
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="rounded-[18px] border border-hairline bg-card px-6 py-10 text-center shadow-[0_1px_3px_rgba(11,18,32,0.06)]">
      <span
        aria-hidden="true"
        className="mx-auto flex size-12 items-center justify-center rounded-full bg-mint text-forest-deep"
      >
        {icon}
      </span>
      <h2 className="mt-4 font-head text-[18px] font-semibold tracking-[-0.01em] text-charcoal">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-[34ch] text-[13px] leading-relaxed text-fog">
        {description}
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-12 items-center justify-center rounded-[15px] bg-charcoal px-6 text-[14px] font-semibold text-white transition-colors hover:bg-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-deep"
      >
        Browse stalls
      </Link>
    </div>
  )
}

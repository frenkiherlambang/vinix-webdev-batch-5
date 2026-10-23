import Link from 'next/link'

export default function AppNotFound() {
  return (
    <div className="flex flex-1 flex-col justify-center py-10">
      <div className="rounded-[18px] border border-hairline bg-card px-6 py-10 text-center shadow-[0_1px_3px_rgba(11,18,32,0.06)]">
        <p className="font-head text-[13px] font-semibold text-forest-deep">
          404
        </p>
        <h1 className="mt-2 font-head text-[20px] font-semibold tracking-[-0.01em] text-charcoal">
          This stall is not here
        </h1>
        <p className="mx-auto mt-2 max-w-[34ch] text-[13px] leading-relaxed text-fog">
          The stall may have closed, or the link is wrong. Head back to the
          list.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-[15px] bg-charcoal px-6 text-[14px] font-semibold text-white transition-colors hover:bg-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-deep"
        >
          Back to stalls
        </Link>
      </div>
    </div>
  )
}

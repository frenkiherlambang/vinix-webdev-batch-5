'use client'

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-1 flex-col justify-center py-10">
      <div className="rounded-[18px] border border-hairline bg-card px-6 py-10 text-center shadow-[0_1px_3px_rgba(11,18,32,0.06)]">
        <h1 className="font-head text-[20px] font-semibold tracking-[-0.01em] text-charcoal">
          We could not load the canteen
        </h1>
        <p className="mx-auto mt-2 max-w-[34ch] text-[13px] leading-relaxed text-fog">
          Check your connection and try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex h-12 items-center justify-center rounded-[15px] bg-charcoal px-6 text-[14px] font-semibold text-white transition-colors hover:bg-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-deep"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

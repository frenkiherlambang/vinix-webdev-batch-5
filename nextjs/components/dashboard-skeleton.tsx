export function DashboardSkeleton() {
  return (
    <div className="flex flex-1 flex-col" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading canteen stalls</span>

      <div className="flex items-center gap-3 pb-4" aria-hidden="true">
        <div className="size-[42px] shrink-0 rounded-full bg-card" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-32 rounded bg-card" />
          <div className="h-3 w-40 rounded bg-card" />
        </div>
        <div className="size-11 shrink-0 rounded-full bg-card" />
      </div>

      <div className="flex flex-col gap-4" aria-hidden="true">
        <div className="h-12 rounded-[14px] border border-hairline bg-card" />

        <div className="flex flex-wrap gap-2">
          {[46, 56, 80, 69].map((width) => (
            <div
              key={width}
              className="h-11 rounded-full bg-card"
              style={{ width }}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="h-4 w-24 rounded bg-card" />
          <div className="h-3 w-14 rounded bg-card" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className="flex items-center gap-3 rounded-[18px] border border-hairline bg-card p-2.5"
            >
              <div className="size-[74px] shrink-0 rounded-[14px] bg-card-soft" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-2/3 rounded bg-card-soft" />
                <div className="h-3 w-1/2 rounded bg-card-soft" />
                <div className="h-3 w-24 rounded bg-card-soft" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

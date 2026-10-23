'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import { ChevronRightIcon, SearchIcon, StarIcon } from '@/components/icons'
import {
  STALLS,
  STALL_CATEGORIES,
  STALL_CATEGORY_LABELS,
  stallCountLabel,
  type StallCategory,
} from '@/lib/stalls'

type DashboardScreenProps = {
  initial: string
}

export function DashboardScreen({ initial }: DashboardScreenProps) {
  const searchRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<StallCategory>('all')

  const stalls = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return STALLS.filter((stall) => {
      const matchesCategory =
        category === 'all' || stall.categories.includes(category)
      const haystack =
        `${stall.name} ${stall.meta} ${stall.categories.join(' ')}`.toLowerCase()

      return matchesCategory && (!needle || haystack.includes(needle))
    })
  }, [category, query])

  const hasFilters = query.trim().length > 0 || category !== 'all'
  const isEmpty = stalls.length === 0

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-3 pb-4">
        <span
          aria-hidden="true"
          className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-mint font-head text-[15px] font-semibold text-forest-deep"
        >
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-head text-[19px] font-semibold tracking-[-0.01em] text-charcoal">
            Canteen
          </h1>
          <p className="mt-0.5 truncate text-[12px] text-fog">
            Block B1 · {STALLS.length} stalls open
          </p>
        </div>
        <button
          type="button"
          onClick={() => searchRef.current?.focus()}
          aria-label="Search stalls"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-card text-charcoal shadow-[0_1px_3px_rgba(11,18,32,0.08)] transition-colors hover:bg-card-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-deep"
        >
          <SearchIcon className="size-[18px]" />
        </button>
      </header>

      <div className="flex flex-col gap-4">
        <div className="flex h-12 items-center gap-2.5 rounded-[14px] border border-hairline-strong bg-card px-3.5 focus-within:border-forest-deep focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-forest-deep">
          <SearchIcon className="size-[17px] shrink-0 text-fog" />
          <label htmlFor="stall-search" className="sr-only">
            Search stalls
          </label>
          <input
            ref={searchRef}
            id="stall-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search warung, dish, or drink"
            autoComplete="off"
            className="h-full w-full bg-transparent text-[13px] text-charcoal placeholder:text-fog focus:outline-none"
          />
        </div>

        <div
          role="group"
          aria-label="Filter stalls by category"
          className="flex flex-wrap gap-2"
        >
          {STALL_CATEGORIES.map((id) => {
            const active = category === id

            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(id)}
                className={`flex h-11 items-center rounded-full px-4 text-[12.5px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-deep ${
                  active
                    ? 'bg-charcoal font-semibold text-white'
                    : 'border border-hairline-strong bg-card font-medium text-ink-soft hover:bg-card-soft'
                }`}
              >
                {STALL_CATEGORY_LABELS[id]}
              </button>
            )
          })}
        </div>

        <div className="flex items-center justify-between gap-4">
          <h2 className="font-head text-[16px] font-semibold tracking-[-0.01em] text-charcoal">
            Open now
          </h2>
          <p aria-live="polite" className="text-[12px] text-fog">
            {stallCountLabel(stalls.length)}
          </p>
        </div>

        {isEmpty ? (
          <div
            role="status"
            className="rounded-[18px] border border-hairline-strong bg-card px-6 py-8 text-center"
          >
            <h3 className="font-head text-[16px] font-semibold text-charcoal">
              {hasFilters
                ? 'No stalls match that search'
                : 'No stalls are open right now'}
            </h3>
            <p className="mx-auto mt-2 max-w-[32ch] text-[12.5px] leading-relaxed text-fog">
              {hasFilters
                ? 'Try another dish, or clear the filters to see every open stall.'
                : 'The canteen has not opened a stall yet. Check back later.'}
            </p>
            {hasFilters ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setCategory('all')
                }}
                className="mt-4 inline-flex h-11 items-center justify-center rounded-[12px] bg-charcoal px-5 text-[13px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-deep"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {stalls.map((stall) => (
              <li key={stall.slug}>
                <Link
                  href={`/stalls/${stall.slug}`}
                  className="group flex h-full items-center gap-3 rounded-[18px] border border-hairline-strong bg-card p-2.5 shadow-[0_1px_3px_rgba(11,18,32,0.06)] transition-colors hover:bg-card-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-deep"
                >
                  <Image
                    src={stall.image}
                    alt=""
                    width={148}
                    height={148}
                    sizes="74px"
                    className="size-[74px] shrink-0 rounded-[14px] object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-head text-[15.5px] font-semibold tracking-[-0.01em] text-charcoal">
                      {stall.name}
                    </h3>
                    <p className="mt-0.5 truncate text-[11.5px] text-fog">
                      {stall.meta}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-[11px]">
                      <StarIcon className="size-3 text-amber-ink" />
                      <span className="font-semibold text-ink-soft">
                        {stall.rating}
                      </span>
                      <span className="text-fog">· {stall.wait}</span>
                    </div>
                  </div>
                  <ChevronRightIcon className="size-4 shrink-0 text-fog transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" />
                </Link>
              </li>
            ))}
          </ul>
        )}

        <p className="text-[11.5px] leading-relaxed text-fog">
          Every stall takes QRIS. The 10% student discount is already in the
          price.
        </p>
      </div>
    </div>
  )
}

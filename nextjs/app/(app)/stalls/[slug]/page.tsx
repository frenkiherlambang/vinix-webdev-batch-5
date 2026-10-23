import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeftIcon, StarIcon } from '@/components/icons'
import { STALLS, getStall } from '@/lib/stalls'

export function generateStaticParams() {
  return STALLS.map((stall) => ({ slug: stall.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/stalls/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const stall = getStall(slug)

  if (!stall) {
    return { title: 'Stall not found · Vinix Canteen' }
  }

  return {
    title: `${stall.name} · Vinix Canteen`,
    description: `${stall.meta} at the Vinix Canteen.`,
  }
}

export default async function StallPage({
  params,
}: PageProps<'/stalls/[slug]'>) {
  const { slug } = await params
  const stall = getStall(slug)

  if (!stall) {
    notFound()
  }

  return (
    <div className="flex flex-1 flex-col">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center gap-1 self-start text-[13px] font-semibold text-forest-deep hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-deep"
      >
        <ChevronLeftIcon className="size-4" />
        All stalls
      </Link>

      <article className="mt-4 overflow-hidden rounded-[18px] border border-hairline bg-card shadow-[0_1px_3px_rgba(11,18,32,0.06)]">
        <div className="relative aspect-[16/9] w-full bg-card-soft">
          <Image
            src={stall.image}
            alt=""
            fill
            priority
            sizes="(min-width: 760px) 760px, 100vw"
            className="object-cover"
          />
        </div>
        <div className="p-5">
          <h1 className="font-head text-[22px] font-semibold tracking-[-0.02em] text-charcoal">
            {stall.name}
          </h1>
          <p className="mt-1 text-[13px] text-fog">{stall.meta}</p>
          <div className="mt-3 flex items-center gap-1.5 text-[12px]">
            <StarIcon className="size-3.5 text-amber-ink" />
            <span className="font-semibold text-ink-soft">{stall.rating}</span>
            <span className="text-fog">· {stall.wait}</span>
          </div>
        </div>
      </article>

      <div className="mt-4 rounded-[18px] border border-hairline bg-card p-6 text-center">
        <h2 className="font-head text-[18px] font-semibold text-charcoal">
          Menu coming soon
        </h2>
        <p className="mx-auto mt-2 max-w-[36ch] text-[13px] leading-relaxed text-fog">
          This stall has not added its dishes to the app yet. Check back soon.
        </p>
      </div>
    </div>
  )
}

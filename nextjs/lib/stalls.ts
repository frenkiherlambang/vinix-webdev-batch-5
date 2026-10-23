export const STALL_CATEGORIES = ['all', 'rice', 'noodles', 'drinks'] as const

export type StallCategory = (typeof STALL_CATEGORIES)[number]
export type StallFilter = Exclude<StallCategory, 'all'>

export type Stall = {
  slug: string
  name: string
  meta: string
  rating: number
  wait: string
  image: string
  categories: StallFilter[]
}

// Demo stalls from the Module 5 design. Swap this for the canteen data source
// when the ordering backend exists.
export const STALLS: Stall[] = [
  {
    slug: 'warung-bu-sri',
    name: 'Warung Bu Sri',
    meta: 'Rice bowls · 8 dishes',
    rating: 4.8,
    wait: '12–18 min',
    image: '/stalls/warung-bu-sri.jpg',
    categories: ['rice'],
  },
  {
    slug: 'nasi-goreng-pak-kumis',
    name: 'Nasi Goreng Pak Kumis',
    meta: 'Fried rice · 5 dishes',
    rating: 4.6,
    wait: '10–15 min',
    image: '/stalls/nasi-goreng-pak-kumis.jpg',
    categories: ['rice'],
  },
  {
    slug: 'kedai-kopi-teh-nusa',
    name: 'Kedai Kopi & Teh Nusa',
    meta: 'Drinks · 12 items',
    rating: 4.9,
    wait: '4–7 min',
    image: '/stalls/kedai-kopi-teh-nusa.jpg',
    categories: ['drinks'],
  },
]

export const STALL_CATEGORY_LABELS: Record<StallCategory, string> = {
  all: 'All',
  rice: 'Rice',
  noodles: 'Noodles',
  drinks: 'Drinks',
}

export function getStall(slug: string) {
  return STALLS.find((stall) => stall.slug === slug)
}

export function stallCountLabel(count: number) {
  return `${count} ${count === 1 ? 'stall' : 'stalls'}`
}

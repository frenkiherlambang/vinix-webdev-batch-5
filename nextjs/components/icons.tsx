import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const outlineProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
}

export function SearchIcon(props: IconProps) {
  return (
    <svg width={20} height={20} {...outlineProps} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20.5 20.5-4.2-4.2" />
    </svg>
  )
}

export function UtensilsIcon(props: IconProps) {
  return (
    <svg width={20} height={20} {...outlineProps} {...props}>
      <path d="M3 2v7a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-5 5v6a2 2 0 0 0 2 2h3Z" />
      <path d="M21 15v7" />
    </svg>
  )
}

export function TrayIcon(props: IconProps) {
  return (
    <svg width={20} height={20} {...outlineProps} {...props}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

export function ReceiptIcon(props: IconProps) {
  return (
    <svg width={20} height={20} {...outlineProps} {...props}>
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M8 7h8" />
      <path d="M8 11h8" />
      <path d="M8 15h5" />
    </svg>
  )
}

export function UserIcon(props: IconProps) {
  return (
    <svg width={20} height={20} {...outlineProps} {...props}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export function StarIcon(props: IconProps) {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="m12 2.6 2.86 5.8 6.39.93-4.62 4.51 1.09 6.36L12 17.2l-5.72 3 1.09-6.36-4.62-4.51 6.39-.93L12 2.6Z" />
    </svg>
  )
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg width={16} height={16} {...outlineProps} {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg width={16} height={16} {...outlineProps} {...props}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <svg width={16} height={16} {...outlineProps} {...props}>
      <path d="m5 12 5 5L20 7" />
    </svg>
  )
}

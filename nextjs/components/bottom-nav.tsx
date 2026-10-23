'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ReceiptIcon,
  TrayIcon,
  UserIcon,
  UtensilsIcon,
} from '@/components/icons'

const ITEMS = [
  {
    href: '/',
    label: 'Menu',
    Icon: UtensilsIcon,
    isActive: (path: string) => path === '/' || path.startsWith('/stalls'),
  },
  {
    href: '/tray',
    label: 'Tray',
    Icon: TrayIcon,
    isActive: (path: string) => path.startsWith('/tray'),
  },
  {
    href: '/orders',
    label: 'Orders',
    Icon: ReceiptIcon,
    isActive: (path: string) => path.startsWith('/orders'),
  },
  {
    href: '/profile',
    label: 'Profile',
    Icon: UserIcon,
    isActive: (path: string) => path.startsWith('/profile'),
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <nav
        aria-label="Main"
        className="pointer-events-auto flex w-full max-w-[420px] gap-1 rounded-full border border-hairline bg-white/85 p-1.5 shadow-[0_6px_18px_rgba(11,18,32,0.08)] backdrop-blur-[20px]"
      >
        {ITEMS.map(({ href, label, Icon, isActive }) => {
          const active = isActive(pathname)

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`flex h-[52px] flex-1 flex-col items-center justify-center gap-1 rounded-full text-[10px] leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-deep ${
                active
                  ? 'bg-mint font-semibold text-forest-deep'
                  : 'font-medium text-fog hover:bg-card-soft hover:text-charcoal'
              }`}
            >
              <Icon className="size-[21px]" />
              {label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

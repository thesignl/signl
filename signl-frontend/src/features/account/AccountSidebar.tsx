'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'

const NAV = [
  { href: '/account/subscription', label: 'Subscription' },
  { href: '/account/billing', label: 'Billing' },
]

export default function AccountSidebar() {
  const pathname = usePathname()

  return (
    <nav className="account-sidebar" aria-label="Account navigation">
      <div className="acct-sb-header">Account</div>
      <div className="acct-sb-nav">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn('acct-sb-link', pathname === item.href && 'active')}
            aria-current={pathname === item.href ? 'page' : undefined}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

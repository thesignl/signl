'use client'

import Link from 'next/link'
import { cn } from '@/lib/cn'

const tabs: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'macro', label: 'Macro' },
  { key: 'markets', label: 'Markets' },
  { key: 'policy', label: 'Policy' },
  { key: 'infrastructure', label: 'Infrastructure' },
  { key: 'ai', label: 'AI' },
  { key: 'geopolitics', label: 'Geopolitics' },
]

export default function FrameworkTabs({
  current = 'all',
}: {
  current?: string
}) {
  return (
    <div
      className="framework-tabs"
      role="tablist"
      aria-label="Filter by framework topic"
    >
      {tabs.map((tab) => {
        const isActive = current === tab.key
        const href = tab.key === 'all' ? '/analysis' : `/analysis?topic=${tab.key}`
        return (
          <Link
            key={tab.key}
            href={href}
            className={cn('fw-tab')}
            role="tab"
            aria-selected={isActive}
            aria-current={isActive ? 'page' : undefined}
            scroll={false}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}

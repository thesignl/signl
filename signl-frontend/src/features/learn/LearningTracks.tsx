'use client'

import Link from 'next/link'
import { cn } from '@/lib/cn'

const tracks: { key: string; label: string }[] = [
  { key: 'all', label: 'All tracks' },
  { key: 'macro', label: 'Macroeconomics' },
  { key: 'markets', label: 'Market structure' },
  { key: 'ai', label: 'AI systems' },
  { key: 'finance', label: 'Startup finance' },
  { key: 'policy', label: 'Geopolitics' },
]

export default function LearningTracks({
  current = 'all',
}: {
  current?: string
}) {
  return (
    <div
      className="learning-tracks"
      role="tablist"
      aria-label="Filter learn tracks"
    >
      {tracks.map((track) => {
        const isActive = current === track.key
        const href = track.key === 'all' ? '/learn' : `/learn?track=${track.key}`
        return (
          <Link
            key={track.key}
            href={href}
            className={cn('track-pill')}
            role="tab"
            aria-pressed={isActive}
            scroll={false}
          >
            {track.label}
          </Link>
        )
      })}
    </div>
  )
}

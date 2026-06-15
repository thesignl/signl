'use client'

import { useEffect, useState } from 'react'
import { listDrafts } from '@/services/editor.service'
import { listStatusOf } from './editor.helpers'
import type { NavCounts } from './EditorSidebar'

const EMPTY: NavCounts = {
  all: 0,
  drafts: 0,
  review: 0,
  scheduled: 0,
  published: 0,
}

// Tiny module-level cache so navigating between editor pages shows counts
// instantly instead of flashing zeros while the request is in flight.
let cache: NavCounts | null = null

export function computeCounts(
  articles: { status: string; publishAt?: string }[],
): NavCounts {
  const by = (s: string) =>
    articles.filter((a) => listStatusOf(a) === s).length
  return {
    all: articles.length,
    drafts: by('DRAFT'),
    review: by('REVIEW'),
    scheduled: by('SCHEDULED'),
    published: by('PUBLISHED'),
  }
}

/** Provides sidebar nav counts, seeded from cache and refreshed in the background. */
export function useEditorCounts(enabled: boolean) {
  const [counts, setCounts] = useState<NavCounts>(cache ?? EMPTY)

  useEffect(() => {
    if (!enabled) return
    let alive = true
    listDrafts()
      .then((data) => {
        if (!alive) return
        const next = computeCounts(data)
        cache = next
        setCounts(next)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [enabled])

  return counts
}

/** Allow pages that already fetched the list to keep the cache warm. */
export function primeCountsCache(counts: NavCounts) {
  cache = counts
}

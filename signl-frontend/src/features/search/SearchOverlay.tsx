'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

import { useSearchStore } from '@/store/search.store'
import { searchArticles } from '@/services/article.service'
import Dialog from '@/components/ui/Dialog'
import { SearchIcon, CloseIcon } from '@/components/ui/Icon'
import EmptyState from '@/components/ui/EmptyState'
import Skeleton from '@/components/ui/Skeleton'
import type { Article } from '@/types/article'

export default function SearchOverlay() {
  const { open, query, setQuery, closeSearch } = useSearchStore()

  const [results, setResults] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Re-focus when opened
  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 30)
      return () => window.clearTimeout(t)
    }
  }, [open])

  // Search debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    const t = window.setTimeout(async () => {
      try {
        const data = await searchArticles(query.trim())
        setResults(data ?? [])
        setActiveIndex(0)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 220)
    return () => window.clearTimeout(t)
  }, [query])

  // Arrow-key result navigation
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (results.length === 0) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => (i + 1) % results.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex(
          (i) => (i - 1 + results.length) % results.length,
        )
      } else if (e.key === 'Enter') {
        const r = results[activeIndex]
        if (r) {
          window.location.href = `/article/${r.slug}`
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, results, activeIndex])

  if (!open) return null

  return (
    <Dialog
      open={open}
      onClose={closeSearch}
      ariaLabel="Search Signl"
      hideHeader
      panelClassName=""
    >
      <div className="search-input-row">
        <SearchIcon size={18} />
        <input
          ref={inputRef}
          className="search-field"
          placeholder="Search analyses, briefs, learn tracks…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search Signl"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="button"
          className="icon-btn"
          onClick={closeSearch}
          aria-label="Close search"
        >
          <CloseIcon size={18} />
        </button>
      </div>

      <div className="search-results">
        {loading ? (
          <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Skeleton width="60%" height={14} />
            <Skeleton width="40%" height={12} />
            <Skeleton width="70%" height={14} />
          </div>
        ) : query.trim().length === 0 ? (
          <EmptyState
            title="What are you looking for?"
            description="Search across analysis, briefs, learn tracks and authors."
          />
        ) : results.length === 0 ? (
          <EmptyState
            title="No results"
            description="Try a different keyword, or browse Analysis or Learn."
          />
        ) : (
          results.map((article, i) => (
            <Link
              key={article.id}
              href={`/article/${article.slug}`}
              className="search-result"
              onClick={closeSearch}
              data-active={i === activeIndex || undefined}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <div className="search-result-tag">
                {article.category?.name ?? 'Article'}
              </div>
              <div className="search-result-title">{article.title}</div>
            </Link>
          ))
        )}
      </div>

      <div className="search-hint">
        <span>↵ to open</span>
        <span>↑ ↓ to navigate</span>
        <span>Esc to close</span>
      </div>
    </Dialog>
  )
}

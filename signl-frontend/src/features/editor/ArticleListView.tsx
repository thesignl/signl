'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { EditorArticle, ListStatus } from '@/types/editor'
import { fmtCount, listStatusOf } from './editor.helpers'
import { Pill, DepthChips } from './EditorBits'

type SortKey = 'recent' | 'views' | 'az'

const SUBTITLES: Record<string, string> = {
  all: "Everything you've written on SIGNL — across all statuses.",
  drafts:
    "Articles you're still working on. Nothing here is visible to readers.",
  review:
    'Submitted for editorial review. An editor will publish or send back with notes.',
  scheduled:
    'Articles set to publish at a future time. They go live automatically.',
  published: 'Articles live on SIGNL. Edits remain in this view.',
}

const TITLES: Record<string, string> = {
  all: 'My Articles',
  drafts: 'Drafts',
  review: 'In Review',
  scheduled: 'Scheduled',
  published: 'Published',
}

const FILTER_TO_STATUS: Record<string, ListStatus | null> = {
  all: null,
  drafts: 'DRAFT',
  review: 'REVIEW',
  scheduled: 'SCHEDULED',
  published: 'PUBLISHED',
}

export default function ArticleListView({
  articles,
  filter,
}: {
  articles: EditorArticle[]
  filter: keyof typeof FILTER_TO_STATUS
}) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortKey>('recent')

  const statusFilter = FILTER_TO_STATUS[filter] ?? null

  const filtered = useMemo(() => {
    let list = articles.filter((a) => {
      if (statusFilter && listStatusOf(a) !== statusFilter) return false
      if (search && !a.headline.toLowerCase().includes(search.toLowerCase()))
        return false
      return true
    })
    list = [...list].sort((a, b) => {
      if (sort === 'views') return b.views - a.views
      if (sort === 'az') return a.headline.localeCompare(b.headline)
      return (
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    })
    return list
  }, [articles, statusFilter, search, sort])

  return (
    <div className="ed-list-page">
      <div className="ed-page-head">
        <div>
          <h1 className="ed-page-title">{TITLES[filter]}</h1>
          <p className="ed-page-sub">{SUBTITLES[filter]}</p>
        </div>
        <div className="ed-page-actions">
          <button
            className="ed-btn ed-btn-primary"
            onClick={() => router.push('/editor/new')}
          >
            + New Article
          </button>
        </div>
      </div>

      <div className="ed-card">
        <div className="ed-filters">
          <input
            className="ed-search"
            placeholder="Search my articles…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 280 }}
          />
          <div className="ed-filter-spacer" />
          <select
            className="ed-filter-select"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
          >
            <option value="recent">Sort: Recent</option>
            <option value="views">Sort: Most viewed</option>
            <option value="az">Sort: A → Z</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState filter={filter} searching={!!search} />
        ) : (
          <div className="ed-draft-list">
            {filtered.map((a) => (
              <button
                key={a.id}
                className="ed-draft-item"
                onClick={() => router.push(`/editor/${a.id}`)}
              >
                <div>
                  <div className="ed-draft-headline">
                    {a.headline || 'Untitled'}
                  </div>
                  <div className="ed-draft-meta">
                    <span>{a.category?.name ?? 'Uncategorised'}</span>
                    <span className="sep">·</span>
                    <span>
                      Updated{' '}
                      {new Date(a.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <DepthChips depths={a.depths} />
                <Pill status={listStatusOf(a)} />
                {a.views > 0 ? (
                  <div className="ed-draft-stat">
                    {fmtCount(a.views)}
                    <span className="lbl">views</span>
                  </div>
                ) : (
                  <div
                    className="ed-draft-stat"
                    style={{ color: 'var(--ink-5)' }}
                  >
                    —
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({
  filter,
  searching,
}: {
  filter: string
  searching: boolean
}) {
  const router = useRouter()
  const emoji =
    filter === 'drafts'
      ? '✍️'
      : filter === 'scheduled'
        ? '⏰'
        : filter === 'review'
          ? '👀'
          : '📄'
  const title = searching
    ? 'No matches'
    : filter === 'drafts'
      ? 'No drafts yet'
      : filter === 'scheduled'
        ? 'Nothing scheduled'
        : filter === 'review'
          ? 'Nothing in review'
          : filter === 'published'
            ? 'No published articles yet'
            : 'No articles yet'
  const sub = searching
    ? 'Try a different search term.'
    : filter === 'drafts'
      ? 'Start a new draft to begin writing.'
      : filter === 'published'
        ? "Publish your first article — it'll appear here."
        : 'Articles will appear here when their status matches.'

  return (
    <div className="ed-empty">
      <div style={{ fontSize: 32, marginBottom: 14, opacity: 0.4 }}>
        {emoji}
      </div>
      <div className="ed-empty-title">{title}</div>
      <div className="ed-empty-sub">{sub}</div>
      {!searching ? (
        <button
          className="ed-btn ed-btn-primary"
          onClick={() => router.push('/editor/new')}
        >
          Write your first signal →
        </button>
      ) : null}
    </div>
  )
}

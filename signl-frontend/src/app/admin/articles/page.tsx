'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import AdminStatusPill from '@/features/admin/shared/AdminStatusPill'
import { cn } from '@/lib/cn'
import {
  getArticles,
  changeArticleStatus,
  bulkArticleAction,
  getAdminCategories,
} from '@/services/admin.service'
import type { AdminArticle, AdminCategory } from '@/types/admin'

const LIMIT = 20

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'PUBLISHED', label: 'Published' },
  { key: 'DRAFT', label: 'Draft' },
  { key: 'REVIEW', label: 'In Review' },
  { key: 'ARCHIVED', label: 'Archived' },
] as const

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60_000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}d ago`
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

type ToastItem = { id: number; message: string; kind: 'success' | 'error' }

export default function AdminArticlesPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [articles, setArticles] = useState<AdminArticle[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mutating, setMutating] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const toastId = useRef(0)

  function showToast(message: string, kind: 'success' | 'error' = 'success') {
    const id = ++toastId.current
    setToasts(prev => [...prev, { id, message, kind }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200)
  }

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1) }, 420)
    return () => clearTimeout(t)
  }, [searchInput])

  // Fetch categories once for filter dropdown
  useEffect(() => {
    getAdminCategories().then(setCategories).catch(() => {})
  }, [])

  const fetchArticles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getArticles({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        categoryId: categoryFilter !== 'all' ? categoryFilter : undefined,
        search: search || undefined,
        page,
        limit: LIMIT,
      })
      setArticles(result.articles)
      setTotal(result.total)
      setTotalPages(result.totalPages)
      setSelectedIds(new Set())
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }; message?: string }
      setError(err?.response?.data?.message ?? err?.message ?? 'Failed to load articles')
    } finally {
      setLoading(false)
    }
  }, [statusFilter, categoryFilter, search, page])

  useEffect(() => { fetchArticles() }, [fetchArticles])

  function setStatusTab(key: string) {
    setStatusFilter(key)
    setPage(1)
  }

  function setCatFilter(id: string) {
    setCategoryFilter(id)
    setPage(1)
  }

  function clearFilters() {
    setStatusFilter('all')
    setCategoryFilter('all')
    setSearchInput('')
    setSearch('')
    setPage(1)
  }

  function toggleAll() {
    setSelectedIds(prev =>
      prev.size === articles.length
        ? new Set()
        : new Set(articles.map(a => a.id))
    )
  }

  function toggleRow(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function handleStatusChange(id: string, status: string) {
    if (mutating) return
    setMutating(true)
    try {
      await changeArticleStatus(id, status)
      showToast(`Article ${status.charAt(0) + status.slice(1).toLowerCase()}`)
      await fetchArticles()
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      showToast(err?.response?.data?.message ?? 'Failed to update status', 'error')
    } finally {
      setMutating(false)
    }
  }

  async function handleBulkAction(action: 'publish' | 'archive' | 'delete') {
    if (mutating || selectedIds.size === 0) return
    const ids = Array.from(selectedIds)
    setMutating(true)
    try {
      const result = await bulkArticleAction(ids, action)
      const verb = action === 'delete' ? 'deleted' : action === 'publish' ? 'published' : 'archived'
      showToast(`${result.affected} article${result.affected !== 1 ? 's' : ''} ${verb}`)
      await fetchArticles()
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      showToast(err?.response?.data?.message ?? `Bulk ${action} failed`, 'error')
    } finally {
      setMutating(false)
    }
  }

  const isAllSelected = articles.length > 0 && selectedIds.size === articles.length
  const hasSelection = selectedIds.size > 0
  const hasActiveFilter = statusFilter !== 'all' || categoryFilter !== 'all' || search !== ''
  const pageStart = total === 0 ? 0 : (page - 1) * LIMIT + 1
  const pageEnd = Math.min(page * LIMIT, total)

  return (
    <>
      {/* Page header */}
      <div className="admin-page-head">
        <div className="admin-page-head-left">
          <h1 className="admin-page-title">Articles</h1>
          <p className="admin-page-sub">
            All articles across Signl. Filter by status or category, search by headline, bulk publish or archive.
          </p>
        </div>
        <div className="admin-page-actions">
          <Link href="/editor" className="admin-btn-sm admin-btn-accent">
            + New Article
          </Link>
        </div>
      </div>

      {/* Main card */}
      <div className="admin-card-new">

        {/* Filters */}
        <div className="admin-filters">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.key}
              className={cn('admin-filter-chip', statusFilter === tab.key && 'active')}
              onClick={() => setStatusTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
          <div className="admin-filter-spacer" />
          <select
            className="admin-filter-select"
            value={categoryFilter}
            onChange={e => setCatFilter(e.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input
            type="search"
            className="admin-filter-search"
            placeholder="Search headlines…"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
        </div>

        {/* Bulk action bar */}
        {hasSelection && (
          <div className="admin-bulk-bar">
            <span className="admin-bulk-label">{selectedIds.size} selected</span>
            <div className="admin-filter-spacer" />
            <button
              className="admin-btn-ghost"
              onClick={() => handleBulkAction('publish')}
              disabled={mutating}
            >
              Publish
            </button>
            <button
              className="admin-btn-ghost"
              onClick={() => handleBulkAction('archive')}
              disabled={mutating}
            >
              Archive
            </button>
            <button
              className="admin-btn-danger"
              onClick={() => handleBulkAction('delete')}
              disabled={mutating}
            >
              Delete
            </button>
            <button
              className="admin-btn-ghost"
              onClick={() => setSelectedIds(new Set())}
            >
              Clear
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && <div className="admin-loading">Loading articles…</div>}

        {/* Error */}
        {!loading && error && (
          <div style={{ padding: '20px' }}>
            <div className="admin-error">{error}</div>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="col-check">
                    <span
                      className={cn('admin-check', isAllSelected && 'checked')}
                      onClick={toggleAll}
                    />
                  </th>
                  <th>Article</th>
                  <th>Status</th>
                  <th>Author</th>
                  <th className="col-num">Views</th>
                  <th className="col-num">Saves</th>
                  <th>Updated</th>
                  <th className="col-actions" />
                </tr>
              </thead>
              <tbody>
                {articles.length === 0 ? (
                  <tr>
                    <td colSpan={8}>
                      <div className="admin-empty" style={{ padding: '48px 20px' }}>
                        No articles match these filters
                        {hasActiveFilter && (
                          <button
                            onClick={clearFilters}
                            style={{
                              display: 'block',
                              margin: '12px auto 0',
                              fontFamily: 'var(--mono)',
                              fontSize: '10.5px',
                              color: 'var(--accent)',
                              cursor: 'pointer',
                              background: 'none',
                              border: 'none',
                              textDecoration: 'underline',
                              textUnderlineOffset: '2px',
                            }}
                          >
                            Clear filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : articles.map(a => (
                  <tr key={a.id}>
                    <td className="col-check">
                      <span
                        className={cn('admin-check', selectedIds.has(a.id) && 'checked')}
                        onClick={() => toggleRow(a.id)}
                      />
                    </td>
                    <td>
                      <div className="admin-row-title">{a.title}</div>
                      <div className="admin-row-meta">
                        <span>{a.category.name}</span>
                        <span>·</span>
                        <span>{a.articleType}</span>
                        {a.premium && (
                          <span style={{
                            fontFamily: 'var(--mono)',
                            fontSize: '9px',
                            fontWeight: 600,
                            color: 'var(--accent)',
                            background: 'var(--accent-soft)',
                            padding: '1px 5px',
                            borderRadius: '3px',
                            letterSpacing: '0.06em',
                          }}>
                            PRO
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <AdminStatusPill status={a.status} />
                    </td>
                    <td style={{ fontSize: '13px', color: 'var(--ink-2)', whiteSpace: 'nowrap' }}>
                      {a.author.name}
                    </td>
                    <td className="col-num">{fmtNum(a.views)}</td>
                    <td className="col-num">{a._count.bookmarks}</td>
                    <td>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--ink-4)' }}>
                        {relativeTime(a.updatedAt)}
                      </span>
                    </td>
                    <td className="col-actions">
                      {(a.status === 'DRAFT' || a.status === 'REVIEW') ? (
                        <button
                          className="admin-btn-sm"
                          style={{ height: '26px', fontSize: '11px', padding: '0 9px' }}
                          onClick={() => handleStatusChange(a.id, 'PUBLISHED')}
                          disabled={mutating}
                        >
                          Publish
                        </button>
                      ) : a.status === 'PUBLISHED' ? (
                        <button
                          className="admin-btn-sm"
                          style={{ height: '26px', fontSize: '11px', padding: '0 9px' }}
                          onClick={() => handleStatusChange(a.id, 'ARCHIVED')}
                          disabled={mutating}
                        >
                          Archive
                        </button>
                      ) : a.status === 'ARCHIVED' ? (
                        <button
                          className="admin-btn-sm"
                          style={{ height: '26px', fontSize: '11px', padding: '0 9px' }}
                          onClick={() => handleStatusChange(a.id, 'PUBLISHED')}
                          disabled={mutating}
                        >
                          Restore
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && total > LIMIT && (
          <div className="admin-pagination">
            <span className="admin-page-info">
              {pageStart}–{pageEnd} of {total} articles
            </span>
            <div className="admin-page-controls">
              <button
                className="admin-btn-sm"
                style={{ height: '28px', padding: '0 10px', fontSize: '11.5px' }}
                onClick={() => setPage(p => p - 1)}
                disabled={page <= 1}
              >
                ← Prev
              </button>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--ink-4)', padding: '0 8px' }}>
                {page} / {totalPages}
              </span>
              <button
                className="admin-btn-sm"
                style={{ height: '28px', padding: '0 10px', fontSize: '11.5px' }}
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toasts */}
      <div className="admin-toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className={cn('admin-toast', t.kind === 'error' && 'error')}>
            <span>{t.kind === 'success' ? '✓' : '✗'}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </>
  )
}

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { getAdminSubscribers, exportAdminSubscribers } from '@/services/admin.service'
import type { AdminSubscriber, SubscriberListResponse } from '@/types/admin'

const LIMIT = 20

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function buildCsv(rows: AdminSubscriber[]): string {
  const header = ['"Email"', '"Subscribed"']
  const body = rows.map(s => [
    `"${s.email.replace(/"/g, '""')}"`,
    `"${new Date(s.createdAt).toISOString().split('T')[0]}"`,
  ])
  return [header, ...body].map(r => r.join(',')).join('\n')
}

function triggerDownload(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

type ToastItem = { id: number; message: string; kind: 'success' | 'error' }

export default function AdminNewsletterPage() {
  const [result, setResult] = useState<SubscriberListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [exporting, setExporting] = useState(false)

  const [toasts, setToasts] = useState<ToastItem[]>([])
  const toastId = useRef(0)

  function showToast(message: string, kind: 'success' | 'error' = 'success') {
    const id = ++toastId.current
    setToasts(prev => [...prev, { id, message, kind }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200)
  }

  // Debounce search → resets to page 1
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1) }, 400)
    return () => clearTimeout(t)
  }, [searchInput])

  const fetchSubscribers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAdminSubscribers({ search: search || undefined, page, limit: LIMIT })
      setResult(data)
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }; message?: string }
      setError(err?.response?.data?.message ?? err?.message ?? 'Failed to load subscribers')
    } finally {
      setLoading(false)
    }
  }, [search, page])

  useEffect(() => { fetchSubscribers() }, [fetchSubscribers])

  async function handleExport() {
    if (exporting) return
    setExporting(true)
    try {
      const data = await exportAdminSubscribers()
      const csv = buildCsv(data)
      const date = new Date().toISOString().split('T')[0]
      triggerDownload(csv, `signl-subscribers-${date}.csv`)
      showToast(`${data.length} subscriber${data.length !== 1 ? 's' : ''} exported`)
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      showToast(err?.response?.data?.message ?? 'Export failed', 'error')
    } finally {
      setExporting(false)
    }
  }

  const total = result?.total ?? 0
  const totalPages = result?.totalPages ?? 0
  const pageStart = total === 0 ? 0 : (page - 1) * LIMIT + 1
  const pageEnd = Math.min(page * LIMIT, total)

  return (
    <>
      {/* Page header */}
      <div className="admin-page-head">
        <div className="admin-page-head-left">
          <h1 className="admin-page-title">Newsletter</h1>
          <p className="admin-page-sub">
            {!loading && result != null
              ? `${result.total.toLocaleString()} subscriber${result.total !== 1 ? 's' : ''} — `
              : ''}
            Manage your subscriber list.
          </p>
        </div>
        <div className="admin-page-actions">
          <button
            className="admin-btn-sm"
            onClick={handleExport}
            disabled={exporting || loading || total === 0}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 1v7M3 5l3 3 3-3M1 9v1a1 1 0 001 1h8a1 1 0 001-1V9"
                stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {exporting ? 'Exporting…' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Main card */}
      <div className="admin-card-new">

        {/* Search */}
        <div className="admin-filters">
          <div className="admin-filter-spacer" />
          <input
            type="search"
            className="admin-filter-search"
            placeholder="Search by email…"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
        </div>

        {/* Loading */}
        {loading && <div className="admin-loading">Loading subscribers…</div>}

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
                  <th>Email</th>
                  <th style={{ width: 120 }}>Status</th>
                  <th style={{ width: 160 }}>Subscribed</th>
                </tr>
              </thead>
              <tbody>
                {result?.subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={3}>
                      <div className="admin-empty" style={{ padding: '48px 20px' }}>
                        {search ? 'No subscribers match that search' : 'No subscribers yet'}
                        {search && (
                          <button
                            onClick={() => { setSearchInput(''); setSearch('') }}
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
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : result?.subscribers.map(sub => (
                  <tr key={sub.id}>
                    <td>
                      <span style={{ fontSize: '13.5px', color: 'var(--ink-2)' }}>
                        {sub.email}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '3px 9px',
                        borderRadius: '4px',
                        fontSize: '11.5px',
                        fontWeight: 500,
                        background: 'var(--accent-green-soft)',
                        color: 'var(--accent-green)',
                      }}>
                        <span style={{
                          width: 5,
                          height: 5,
                          borderRadius: '50%',
                          background: 'currentColor',
                          flexShrink: 0,
                        }} />
                        Subscribed
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--ink-4)' }}>
                        {formatDate(sub.createdAt)}
                      </span>
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
              {pageStart}–{pageEnd} of {total.toLocaleString()} subscribers
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

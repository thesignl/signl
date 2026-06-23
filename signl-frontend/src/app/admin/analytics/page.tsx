'use client'

import { useCallback, useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import SparkLine from '@/features/admin/shared/SparkLine'
import { getAnalyticsOverview, getAnalyticsViews } from '@/services/admin.service'
import type { AnalyticsOverview, ViewsDataPoint } from '@/types/admin'

const PERIOD_OPTIONS = [
  { label: '7d',  days: 7  },
  { label: '14d', days: 14 },
  { label: '30d', days: 30 },
] as const

type Period = typeof PERIOD_OPTIONS[number]['days']

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

function fmtPct(n: number): string {
  return `${Math.round(n)}%`
}

function fmtTime(minutes: number): string {
  if (!minutes) return '—'
  if (minutes < 1) return `${Math.round(minutes * 60)}s`
  return `${minutes.toFixed(1)}m`
}

function readCompletion(avgReadTime: number, readTime: number): number {
  if (!readTime || !avgReadTime) return 0
  return Math.min(100, Math.round((avgReadTime / readTime) * 100))
}

function formatPublished(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminAnalyticsPage() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null)
  const [overviewLoading, setOverviewLoading] = useState(true)
  const [overviewError, setOverviewError] = useState<string | null>(null)

  const [period, setPeriod] = useState<Period>(30)
  const [viewsData, setViewsData] = useState<ViewsDataPoint[]>([])
  const [viewsLoading, setViewsLoading] = useState(true)
  const [viewsError, setViewsError] = useState<string | null>(null)

  // Fetch overview once
  useEffect(() => {
    setOverviewLoading(true)
    setOverviewError(null)
    getAnalyticsOverview()
      .then(setOverview)
      .catch((e: unknown) => {
        const err = e as { response?: { data?: { message?: string } }; message?: string }
        setOverviewError(err?.response?.data?.message ?? err?.message ?? 'Failed to load analytics')
      })
      .finally(() => setOverviewLoading(false))
  }, [])

  // Fetch views whenever period changes
  const fetchViews = useCallback(async () => {
    setViewsLoading(true)
    setViewsError(null)
    try {
      setViewsData(await getAnalyticsViews(period))
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }; message?: string }
      setViewsError(err?.response?.data?.message ?? err?.message ?? 'Failed to load chart data')
    } finally {
      setViewsLoading(false)
    }
  }, [period])

  useEffect(() => { fetchViews() }, [fetchViews])

  const sparkCounts = viewsData.map(p => p.count)
  const periodTotal = sparkCounts.reduce((s, n) => s + n, 0)
  const agg = overview?.aggregates

  return (
    <>
      {/* Page header */}
      <div className="admin-page-head">
        <div className="admin-page-head-left">
          <h1 className="admin-page-title">Analytics</h1>
          <p className="admin-page-sub">
            Engagement metrics across all published articles.
          </p>
        </div>
      </div>

      {/* Overview KPIs */}
      {overviewLoading && <div className="admin-loading">Loading analytics…</div>}

      {!overviewLoading && overviewError && (
        <div className="admin-error" style={{ marginBottom: 20 }}>{overviewError}</div>
      )}

      {!overviewLoading && agg && (
        <div className="admin-kpi-grid" style={{ marginBottom: 24 }}>
          <div className="admin-kpi">
            <div className="admin-kpi-top">
              <span className="admin-kpi-label">Total Clicks</span>
              <span className="admin-kpi-icon" style={{ background: 'var(--accent-blue-soft)' }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4l8 4-4 1-1 4-3-9z" />
                </svg>
              </span>
            </div>
            <div className="admin-kpi-bottom">
              <span className="admin-kpi-value">{fmtNum(agg.totalClicks)}</span>
            </div>
            <div className="admin-kpi-footer">
              <span className="admin-kpi-sub">from ArticleAnalytics</span>
            </div>
          </div>

          <div className="admin-kpi">
            <div className="admin-kpi-top">
              <span className="admin-kpi-label">Total Shares</span>
              <span className="admin-kpi-icon" style={{ background: 'var(--accent-green-soft)' }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="13" cy="3" r="1.5" />
                  <circle cx="3"  cy="8" r="1.5" />
                  <circle cx="13" cy="13" r="1.5" />
                  <line x1="4.5" y1="7" x2="11.5" y2="4" />
                  <line x1="4.5" y1="9" x2="11.5" y2="12" />
                </svg>
              </span>
            </div>
            <div className="admin-kpi-bottom">
              <span className="admin-kpi-value">{fmtNum(agg.totalShares)}</span>
            </div>
            <div className="admin-kpi-footer">
              <span className="admin-kpi-sub">across all articles</span>
            </div>
          </div>

          <div className="admin-kpi">
            <div className="admin-kpi-top">
              <span className="admin-kpi-label">Avg Engagement</span>
              <span className="admin-kpi-icon" style={{ background: 'var(--accent-amber-soft)' }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="1,12 5,7 9,9 15,3" />
                  <line x1="1" y1="14" x2="15" y2="14" />
                </svg>
              </span>
            </div>
            <div className="admin-kpi-bottom">
              <span className="admin-kpi-value">{fmtPct(100 - agg.avgBounceRate)}</span>
            </div>
            <div className="admin-kpi-footer">
              <span className="admin-kpi-sub">{fmtPct(agg.avgBounceRate)} avg bounce rate</span>
            </div>
          </div>

          <div className="admin-kpi">
            <div className="admin-kpi-top">
              <span className="admin-kpi-label">Avg Read Time</span>
              <span className="admin-kpi-icon" style={{ background: 'var(--accent-violet-soft)' }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="8" cy="8" r="6.5" />
                  <polyline points="8,4 8,8 11,10" />
                </svg>
              </span>
            </div>
            <div className="admin-kpi-bottom">
              <span className="admin-kpi-value">{fmtTime(agg.avgReadTime)}</span>
            </div>
            <div className="admin-kpi-footer">
              <span className="admin-kpi-sub">avg across tracked articles</span>
            </div>
          </div>
        </div>
      )}

      {/* Views trend */}
      <div className="admin-card-new" style={{ marginBottom: 24 }}>
        <div className="admin-card-head">
          <div>
            <span className="admin-card-title">Reading Activity</span>
            {!viewsLoading && !viewsError && (
              <span className="admin-card-title-meta" style={{ marginLeft: 10 }}>
                {periodTotal.toLocaleString()} reads in last {period} days
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {PERIOD_OPTIONS.map(opt => (
              <button
                key={opt.days}
                className={cn('admin-filter-chip', period === opt.days && 'active')}
                style={{ padding: '3px 10px', fontSize: '11px' }}
                onClick={() => setPeriod(opt.days)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="admin-card-body">
          <div className="admin-chart-shell">
            {viewsLoading && (
              <div className="admin-chart-placeholder">
                <span className="admin-chart-placeholder-text">Loading chart…</span>
              </div>
            )}
            {!viewsLoading && viewsError && (
              <div className="admin-chart-placeholder">
                <span className="admin-chart-placeholder-text">{viewsError}</span>
              </div>
            )}
            {!viewsLoading && !viewsError && (
              <>
                <SparkLine data={sparkCounts} height={120} />
                {viewsData.length > 0 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 6,
                    fontFamily: 'var(--mono)',
                    fontSize: '10px',
                    color: 'var(--ink-5)',
                  }}>
                    <span>{viewsData[0]?.date}</span>
                    <span>{viewsData[Math.floor(viewsData.length / 2)]?.date}</span>
                    <span>{viewsData[viewsData.length - 1]?.date}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Top articles */}
      <div className="admin-card-new">
        <div className="admin-card-head">
          <span className="admin-card-title">Top Articles</span>
          <span className="admin-card-title-meta">by all-time views</span>
        </div>

        {overviewLoading && <div className="admin-loading">Loading articles…</div>}

        {!overviewLoading && !overviewError && overview && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 28, paddingRight: 0 }}>#</th>
                  <th>Article</th>
                  <th className="col-num">Views</th>
                  <th className="col-num">Unique</th>
                  <th className="col-num">Saves</th>
                  <th className="col-num" style={{ width: 90 }}>Completion</th>
                  <th className="col-num" style={{ width: 100 }}>Engagement</th>
                </tr>
              </thead>
              <tbody>
                {overview.topArticles.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="admin-empty" style={{ padding: '40px 20px' }}>
                        No published articles yet
                      </div>
                    </td>
                  </tr>
                ) : overview.topArticles.map((article, i) => {
                  const a = article.analytics
                  const completion = a ? readCompletion(a.avgReadTime, article.readTime) : null
                  const engagement = a ? Math.max(0, Math.round(100 - a.bounceRate)) : null

                  return (
                    <tr key={article.id}>
                      <td style={{
                        fontFamily: 'var(--mono)',
                        fontSize: '11px',
                        color: 'var(--ink-5)',
                        width: 28,
                        paddingRight: 0,
                      }}>
                        {i + 1}
                      </td>
                      <td>
                        <div className="admin-row-title" style={{ fontSize: 13 }}>
                          {article.title}
                        </div>
                        <div className="admin-row-meta" style={{ marginTop: 1 }}>
                          <span>{article.categoryName}</span>
                          <span>·</span>
                          <span>{article.authorName}</span>
                          {article.publishedAt && (
                            <>
                              <span>·</span>
                              <span>{formatPublished(article.publishedAt)}</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="col-num">{fmtNum(article.views)}</td>
                      <td className="col-num">
                        {a ? fmtNum(a.uniqueViews) : <span style={{ color: 'var(--ink-5)' }}>—</span>}
                      </td>
                      <td className="col-num">{fmtNum(article.bookmarks)}</td>
                      <td className="col-num">
                        {completion !== null ? (
                          <span style={{ color: completion >= 60 ? 'var(--accent-green)' : 'var(--ink-3)' }}>
                            {fmtPct(completion)}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--ink-5)' }}>—</span>
                        )}
                      </td>
                      <td className="col-num">
                        {engagement !== null ? (
                          <span style={{ color: engagement >= 50 ? 'var(--accent-green)' : 'var(--ink-3)' }}>
                            {fmtPct(engagement)}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--ink-5)' }}>—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

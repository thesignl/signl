'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import EditorLayout from '@/features/editor/EditorLayout'
import { useEditorGuard } from '@/features/editor/useEditorGuard'
import { listDrafts } from '@/services/editor.service'
import { fmtCount } from '@/features/editor/editor.helpers'
import { summarizeAnalytics } from '@/features/editor/editor.analytics'
import type { EditorArticle } from '@/types/editor'

export default function AnalyticsPage() {
  const { ready } = useEditorGuard()
  const router = useRouter()
  const [articles, setArticles] = useState<EditorArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!ready) return
    let alive = true
    listDrafts()
      .then((d) => alive && setArticles(d))
      .catch(() => {})
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [ready])

  const summary = useMemo(() => summarizeAnalytics(articles), [articles])

  if (!ready) return null

  return (
    <EditorLayout
      activeNav="my-analytics"
      crumbs={[{ label: 'Editor' }, { label: 'My Analytics' }]}
    >
      <div className="ed-list-page">
        <div className="ed-page-head">
          <div>
            <h1 className="ed-page-title">My Analytics</h1>
            <p className="ed-page-sub">
              How your articles are performing. Engagement aggregates from the
              past 14 days unless specified otherwise.
            </p>
          </div>
          <div className="ed-page-actions">
            <button className="ed-btn ed-btn-ghost ed-btn-sm">
              Last 14 days
            </button>
          </div>
        </div>

        {loading ? (
          <p className="ed-page-sub">Loading analytics…</p>
        ) : summary.published.length === 0 ? (
          <div className="ed-card">
            <div className="ed-empty">
              <div className="ed-empty-title">No published articles yet</div>
              <div className="ed-empty-sub">
                Publish an article to start seeing performance here.
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="ed-an-grid">
              <div className="ed-an-kpi">
                <div className="ed-an-kpi-label">Total Views</div>
                <div className="ed-an-kpi-value">
                  {fmtCount(summary.totalViews)}
                </div>
              </div>
              <div className="ed-an-kpi">
                <div className="ed-an-kpi-label">Total Saves</div>
                <div className="ed-an-kpi-value">
                  {fmtCount(summary.totalSaves)}
                </div>
              </div>
              <div className="ed-an-kpi">
                <div className="ed-an-kpi-label">Avg Completion</div>
                <div className="ed-an-kpi-value">
                  {summary.avgReadThrough}%
                </div>
              </div>
            </div>

            <div className="ed-card">
              <div className="ed-card-head">
                <div className="ed-card-title">Top performing articles</div>
              </div>
              <div className="ed-draft-list">
                {summary.topByViews.map((a) => (
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
                        {a.category?.name ?? 'Uncategorised'}
                        {a.publishAt ? (
                          <>
                            {' '}
                            · Published{' '}
                            {new Date(a.publishAt).toLocaleDateString()}
                          </>
                        ) : null}
                      </div>
                    </div>
                    <div className="ed-draft-stat">
                      {fmtCount(a.views)}
                      <span className="lbl">views</span>
                    </div>
                    <div className="ed-draft-stat">
                      {fmtCount(a.saves ?? 0)}
                      <span className="lbl">saves</span>
                    </div>
                    <div
                      className="ed-draft-stat"
                      style={{ color: 'var(--accent-green)' }}
                    >
                      {a.readThrough ?? 0}%<span className="lbl">read-through</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </EditorLayout>
  )
}

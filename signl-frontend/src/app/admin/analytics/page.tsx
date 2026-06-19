'use client'

import { useEffect, useState } from 'react'
import { getDashboardStats, getArticles } from '@/services/admin.service'

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null)
  const [top, setTop] = useState<any[]>([])

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => {})
    getArticles({ limit: 10, sortBy: 'views', sortOrder: 'desc' }).then((d: any) => setTop(d.articles ?? d ?? [])).catch(() => {})
  }, [])

  if (!stats) return <div className="admin-page"><p className="admin-page-sub">Loading analytics…</p></div>

  return (
    <div className="admin-page">
      <div className="admin-page-head"><h1 className="admin-page-title">Analytics</h1><p className="admin-page-sub">Platform-wide performance metrics.</p></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
        <Kpi label="Total Views" value={fmt(stats.totalViews ?? 0)} />
        <Kpi label="Total Bookmarks" value={fmt(stats.totalBookmarks ?? 0)} />
        <Kpi label="Published" value={String(stats.publishedArticles ?? 0)} />
        <Kpi label="Subscribers" value={String(stats.totalSubscribers ?? 0)} />
        <Kpi label="Pending Review" value={String(stats.pendingReviewCount ?? 0)} />
        <Kpi label="Editors" value={String(stats.totalEditors ?? 0)} />
      </div>
      <div className="admin-card">
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)', fontWeight: 600, fontSize: 14 }}>Top Articles by Views</div>
        <table className="admin-table"><thead><tr><th>Title</th><th>Type</th><th>Views</th></tr></thead><tbody>
          {top.map((a: any) => <tr key={a.id}><td style={{ fontWeight: 500 }}>{a.title}</td><td style={{ fontFamily: 'var(--mono)', fontSize: 10, textTransform: 'uppercase', color: 'var(--color-content-muted)' }}>{a.articleType}</td><td>{fmt(a.views)}</td></tr>)}
        </tbody></table>
      </div>
    </div>
  )
}

function Kpi({ label, value }: { label: string; value: string }) {
  return <div className="admin-card" style={{ padding: 18 }}><div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--color-content-muted)', marginBottom: 8 }}>{label}</div><div style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 700 }}>{value}</div></div>
}

function fmt(n: number) { return n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k' : String(n) }

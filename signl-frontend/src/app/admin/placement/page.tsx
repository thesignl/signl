'use client'

import { useEffect, useState } from 'react'
import { getPlacements, createPlacement, deletePlacement, getArticles } from '@/services/admin.service'

const SECTIONS = ['hero', 'featured', 'trending', 'learn']

export default function PlacementPage() {
  const [items, setItems] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [section, setSection] = useState('hero')
  const [articleId, setArticleId] = useState('')

  const load = () => { getPlacements().then(setItems).catch(() => {}) }
  useEffect(() => { load(); getArticles({ status: 'PUBLISHED', limit: 50 }).then((d: any) => setArticles(d.articles ?? d)).catch(() => {}) }, [])

  const handleCreate = async () => {
    if (!articleId) return
    await createPlacement({ articleId, section })
    setArticleId('')
    load()
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head"><h1 className="admin-page-title">Homepage Placements</h1><p className="admin-page-sub">Control Hero, Featured, Trending, and Learn sections.</p></div>
      <div className="admin-card" style={{ padding: 18, marginBottom: 18, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <select className="admin-input" value={section} onChange={e => setSection(e.target.value)}>{SECTIONS.map(s => <option key={s} value={s}>{s[0].toUpperCase()+s.slice(1)}</option>)}</select>
        <select className="admin-input" value={articleId} onChange={e => setArticleId(e.target.value)} style={{ flex: 1 }}><option value="">Select article…</option>{articles.map((a: any) => <option key={a.id} value={a.id}>{a.title}</option>)}</select>
        <button className="admin-btn admin-btn-primary" onClick={handleCreate}>+ Add</button>
      </div>
      {SECTIONS.map(sec => { const si = items.filter((p: any) => p.section === sec); return (
        <div key={sec} className="admin-card" style={{ marginBottom: 16 }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--color-content-3)' }}>{sec} ({si.length})</div>
          {si.length === 0 ? <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-content-muted)', fontSize: 13 }}>Empty</div> : (
            <table className="admin-table"><tbody>{si.map((p: any) => <tr key={p.id}><td style={{ fontWeight: 500 }}>{p.article?.title ?? '—'}</td><td style={{ textAlign: 'right' }}><button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => { deletePlacement(p.id).then(load) }}>Remove</button></td></tr>)}</tbody></table>
          )}
        </div>
      )})}
    </div>
  )
}

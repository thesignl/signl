'use client'

import { useEffect, useState } from 'react'
import { getArticles, changeArticleStatus, bulkArticleAction } from '@/services/admin.service'

export default function ArticlesPage() {
  const [items, setItems] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState<string[]>([])

  const load = () => {
    const params: any = { page, limit: 20 }
    if (status) params.status = status
    getArticles(params).then((d: any) => { setItems(d.articles ?? []); setTotal(d.total ?? 0) }).catch(() => {})
  }
  useEffect(load, [page, status])

  const toggle = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  const handleStatus = async (id: string, s: string) => { await changeArticleStatus(id, s); load() }
  const handleBulk = async (action: string) => { if (!selected.length) return; await bulkArticleAction(selected, action); setSelected([]); load() }

  return (
    <div className="admin-page">
      <div className="admin-page-head"><h1 className="admin-page-title">Articles</h1><p className="admin-page-sub">Moderate, publish, archive articles. {total} total.</p></div>
      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {['', 'DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'].map(s => <button key={s} className={`admin-btn admin-btn-sm ${status === s ? 'admin-btn-primary' : 'admin-btn-ghost'}`} onClick={() => { setStatus(s); setPage(1) }}>{s || 'All'}</button>)}
          <div style={{ flex: 1 }} />
          {selected.length > 0 && <>
            <button className="admin-btn admin-btn-sm admin-btn-primary" onClick={() => handleBulk('publish')}>Publish ({selected.length})</button>
            <button className="admin-btn admin-btn-sm admin-btn-ghost" onClick={() => handleBulk('archive')}>Archive</button>
            <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleBulk('delete')}>Delete</button>
          </>}
        </div>
        <table className="admin-table">
          <thead><tr><th style={{ width: 30 }}></th><th>Title</th><th>Type</th><th>Status</th><th>Views</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
          <tbody>
            {items.map((a: any) => (
              <tr key={a.id}>
                <td><input type="checkbox" checked={selected.includes(a.id)} onChange={() => toggle(a.id)} /></td>
                <td style={{ fontWeight: 500 }}>{a.title}</td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.05em', textTransform: 'uppercase', color: 'var(--color-content-muted)' }}>{a.articleType}</td>
                <td><span style={{ fontFamily: 'var(--mono)', fontSize: 10, padding: '2px 8px', borderRadius: 12, background: a.status === 'PUBLISHED' ? '#e6f1ec' : a.status === 'DRAFT' ? '#f1ede4' : a.status === 'REVIEW' ? '#fbf4dc' : '#f1ede4', color: a.status === 'PUBLISHED' ? '#1a6b3c' : a.status === 'REVIEW' ? '#8a6810' : 'var(--color-content-muted)' }}>{a.status}</span></td>
                <td>{a.views}</td>
                <td style={{ textAlign: 'right' }}>
                  {a.status !== 'PUBLISHED' && <button className="admin-btn admin-btn-sm admin-btn-ghost" onClick={() => handleStatus(a.id, 'PUBLISHED')}>Publish</button>}
                  {a.status !== 'ARCHIVED' && <button className="admin-btn admin-btn-sm admin-btn-ghost" onClick={() => handleStatus(a.id, 'ARCHIVED')}>Archive</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {total > 20 && <div style={{ padding: 12, display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button className="admin-btn admin-btn-sm admin-btn-ghost" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span style={{ fontSize: 12, color: 'var(--color-content-muted)', padding: '6px 0' }}>Page {page}</span>
          <button className="admin-btn admin-btn-sm admin-btn-ghost" onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>}
      </div>
    </div>
  )
}

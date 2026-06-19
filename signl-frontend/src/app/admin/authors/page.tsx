'use client'

import { useEffect, useState } from 'react'
import { getAuthors, updateAuthor } from '@/services/admin.service'

export default function AuthorsPage() {
  const [items, setItems] = useState<any[]>([])
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', bio: '', twitter: '', linkedin: '' })

  const load = () => { getAuthors().then(setItems).catch(() => {}) }
  useEffect(load, [])

  const startEdit = (a: any) => { setEditId(a.id); setForm({ title: a.title ?? '', bio: a.bio ?? '', twitter: a.twitter ?? '', linkedin: a.linkedin ?? '' }) }
  const save = async () => { if (!editId) return; await updateAuthor(editId, form); setEditId(null); load() }

  return (
    <div className="admin-page">
      <div className="admin-page-head"><h1 className="admin-page-title">Authors</h1><p className="admin-page-sub">Editors with byline profiles.</p></div>
      <div className="admin-card">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Title</th><th>Articles</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
          <tbody>
            {items.map((a: any) => (
              <tr key={a.id}>
                <td style={{ fontWeight: 500 }}>{a.name}</td>
                <td style={{ fontSize: 12, color: 'var(--color-content-muted)' }}>{a.email}</td>
                <td>{editId === a.id ? <input className="admin-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /> : (a.title ?? '—')}</td>
                <td>{a._count?.authoredArticles ?? 0}</td>
                <td style={{ textAlign: 'right' }}>
                  {editId === a.id ? <><button className="admin-btn admin-btn-sm admin-btn-primary" onClick={save}>Save</button><button className="admin-btn admin-btn-sm admin-btn-ghost" onClick={() => setEditId(null)}>Cancel</button></> : <button className="admin-btn admin-btn-sm admin-btn-ghost" onClick={() => startEdit(a)}>Edit</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

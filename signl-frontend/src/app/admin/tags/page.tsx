'use client'

import { useEffect, useState } from 'react'
import { getTags, createTag, updateTag, deleteTag } from '@/services/admin.service'

interface Tag { id: string; name: string; slug: string | null; _count?: { articles: number } }

export default function TagsPage() {
  const [items, setItems] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const load = () => {
    getTags().then(setItems).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleCreate = async () => {
    if (!name.trim()) return
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)
    await createTag({ name: name.trim(), slug })
    setName('')
    load()
  }

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return
    await updateTag(id, { name: editName.trim() })
    setEditingId(null)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tag?')) return
    await deleteTag(id)
    load()
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1 className="admin-page-title">Tags</h1>
        <p className="admin-page-sub">Manage article tags for cross-cutting topics.</p>
      </div>

      <div className="admin-card" style={{ padding: 18, marginBottom: 18, display: 'flex', gap: 10, alignItems: 'center' }}>
        <input
          className="admin-input"
          placeholder="New tag name…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          style={{ flex: 1 }}
        />
        <button className="admin-btn admin-btn-primary" onClick={handleCreate}>+ Create</button>
      </div>

      <div className="admin-card">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-4)' }}>Loading…</div>
        ) : items.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-4)' }}>No tags yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Articles</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.id}>
                  <td>
                    {editingId === t.id ? (
                      <input className="admin-input" value={editName} onChange={(e) => setEditName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleUpdate(t.id)} autoFocus />
                    ) : (
                      <span style={{ fontWeight: 500 }}>{t.name}</span>
                    )}
                  </td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-4)' }}>{t.slug ?? '—'}</td>
                  <td>{t._count?.articles ?? 0}</td>
                  <td style={{ textAlign: 'right' }}>
                    {editingId === t.id ? (
                      <>
                        <button className="admin-btn admin-btn-sm" onClick={() => handleUpdate(t.id)}>Save</button>
                        <button className="admin-btn admin-btn-sm admin-btn-ghost" onClick={() => setEditingId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="admin-btn admin-btn-sm admin-btn-ghost" onClick={() => { setEditingId(t.id); setEditName(t.name) }}>Edit</button>
                        <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleDelete(t.id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

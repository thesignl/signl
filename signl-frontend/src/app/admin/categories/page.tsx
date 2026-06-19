'use client'

import { useEffect, useState } from 'react'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryActive,
} from '@/services/admin.service'

interface Category {
  id: string
  name: string
  slug: string | null
  short: string | null
  color: string | null
  description: string | null
  displayOrder: number
  active: boolean
  _count?: { articles: number }
}

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const load = () => {
    getCategories()
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleCreate = async () => {
    if (!name.trim()) return
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)
    await createCategory({ name: name.trim(), slug })
    setName('')
    load()
  }

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return
    await updateCategory(id, { name: editName.trim() })
    setEditingId(null)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? Articles in it will be orphaned.')) return
    await deleteCategory(id)
    load()
  }

  const handleToggle = async (id: string) => {
    await toggleCategoryActive(id)
    load()
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1 className="admin-page-title">Categories</h1>
        <p className="admin-page-sub">
          Organize articles by topic. Deactivated categories are hidden from
          readers but preserved in the database.
        </p>
      </div>

      {/* Create form */}
      <div className="admin-card" style={{ padding: 18, marginBottom: 18, display: 'flex', gap: 10, alignItems: 'center' }}>
        <input
          className="admin-input"
          placeholder="New category name…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          style={{ flex: 1 }}
        />
        <button className="admin-btn admin-btn-primary" onClick={handleCreate}>
          + Create
        </button>
      </div>

      {/* Table */}
      <div className="admin-card">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-4)' }}>Loading…</div>
        ) : items.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-4)' }}>No categories yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Active</th>
                <th>Articles</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id}>
                  <td>
                    {editingId === c.id ? (
                      <input
                        className="admin-input"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdate(c.id)}
                        autoFocus
                      />
                    ) : (
                      <span style={{ fontWeight: 500 }}>{c.name}</span>
                    )}
                  </td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-4)' }}>
                    {c.slug ?? '—'}
                  </td>
                  <td>
                    <button
                      className={`admin-toggle ${c.active ? 'on' : ''}`}
                      onClick={() => handleToggle(c.id)}
                      aria-label={c.active ? 'Deactivate' : 'Activate'}
                    >
                      <span className="admin-toggle-track"><span className="admin-toggle-thumb" /></span>
                    </button>
                  </td>
                  <td>{c._count?.articles ?? 0}</td>
                  <td style={{ textAlign: 'right' }}>
                    {editingId === c.id ? (
                      <>
                        <button className="admin-btn admin-btn-sm" onClick={() => handleUpdate(c.id)}>Save</button>
                        <button className="admin-btn admin-btn-sm admin-btn-ghost" onClick={() => setEditingId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="admin-btn admin-btn-sm admin-btn-ghost" onClick={() => { setEditingId(c.id); setEditName(c.name) }}>Edit</button>
                        <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleDelete(c.id)}>Delete</button>
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

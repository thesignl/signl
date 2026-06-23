'use client'

<<<<<<< HEAD
import { useCallback, useEffect, useRef, useState } from 'react'
import AdminModal from '@/features/admin/shared/AdminModal'
import { cn } from '@/lib/cn'
import {
  getAdminTags,
  createAdminTag,
  updateAdminTag,
  deleteAdminTag,
} from '@/services/admin.service'
import type { AdminTag } from '@/types/admin'

type ToastItem = { id: number; message: string; kind: 'success' | 'error' }
type ModalMode = 'create' | 'edit'

type TagForm = { name: string; slug: string }

const EMPTY_FORM: TagForm = { name: '', slug: '' }

function toSlug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export default function AdminTagsPage() {
  const [tags, setTags] = useState<AdminTag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const [modalMode, setModalMode] = useState<ModalMode>('create')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<TagForm>(EMPTY_FORM)
  const [slugTouched, setSlugTouched] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<AdminTag | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [toasts, setToasts] = useState<ToastItem[]>([])
  const toastId = useRef(0)

  function showToast(message: string, kind: 'success' | 'error' = 'success') {
    const id = ++toastId.current
    setToasts(prev => [...prev, { id, message, kind }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200)
  }

  const fetchTags = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAdminTags()
      setTags(data.slice().sort((a, b) => a.name.localeCompare(b.name)))
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }; message?: string }
      setError(err?.response?.data?.message ?? err?.message ?? 'Failed to load tags')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTags() }, [fetchTags])

  function setField(key: keyof TagForm, value: string) {
    if (key === 'slug') setSlugTouched(true)
    setForm(prev => {
      const next = { ...prev, [key]: value }
      if (key === 'name' && !slugTouched) next.slug = toSlug(value)
      return next
    })
  }

  function openCreate() {
    setModalMode('create')
    setEditingId(null)
    setForm(EMPTY_FORM)
    setSlugTouched(false)
    setFormError(null)
    setModalOpen(true)
  }

  function openEdit(tag: AdminTag) {
    setModalMode('edit')
    setEditingId(tag.id)
    setForm({ name: tag.name, slug: tag.slug ?? '' })
    setSlugTouched(true)
    setFormError(null)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingId(null)
    setFormError(null)
  }

  function validateForm(): string | null {
    if (!form.name.trim()) return 'Name is required'
    if (!form.slug.trim()) return 'Slug is required'
    if (!/^[a-z0-9-]+$/.test(form.slug.trim())) return 'Slug must be lowercase letters, numbers, and hyphens only'
    return null
  }

  async function handleSave() {
    const err = validateForm()
    if (err) { setFormError(err); return }
    setSaving(true)
    setFormError(null)
    const payload = { name: form.name.trim(), slug: form.slug.trim() }
    try {
      if (modalMode === 'create') {
        await createAdminTag(payload)
        showToast(`"${payload.name}" created`)
      } else if (editingId) {
        await updateAdminTag(editingId, payload)
        showToast(`"${payload.name}" updated`)
      }
      closeModal()
      await fetchTags()
    } catch (e: unknown) {
      const apiErr = e as { response?: { data?: { message?: string } } }
      setFormError(apiErr?.response?.data?.message ?? 'Failed to save tag')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteAdminTag(deleteTarget.id)
      showToast(`"${deleteTarget.name}" deleted`)
      setDeleteTarget(null)
      await fetchTags()
    } catch (e: unknown) {
      const apiErr = e as { response?: { data?: { message?: string } } }
      showToast(apiErr?.response?.data?.message ?? 'Failed to delete tag', 'error')
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  const filtered = search.trim()
    ? tags.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        (t.slug ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : tags

  return (
    <>
      {/* Page header */}
      <div className="admin-page-head">
        <div className="admin-page-head-left">
          <h1 className="admin-page-title">Tags</h1>
          <p className="admin-page-sub">
            {!loading && `${tags.length} tag${tags.length !== 1 ? 's' : ''} — `}
            Create, rename, and delete article tags.
          </p>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn-sm admin-btn-accent" onClick={openCreate}>
            + New Tag
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
            placeholder="Search tags…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Loading */}
        {loading && <div className="admin-loading">Loading tags…</div>}

        {/* Error */}
        {!loading && error && (
          <div style={{ padding: '20px' }}>
            <div className="admin-error">{error}</div>
          </div>
        )}

        {/* Pill grid */}
        {!loading && !error && (
          filtered.length === 0 ? (
            <div className="admin-empty" style={{ padding: '48px 20px' }}>
              {search ? 'No tags match that search' : 'No tags yet — create your first one above.'}
              {search && (
                <button
                  onClick={() => setSearch('')}
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
          ) : (
            <div className="admin-tag-grid">
              {filtered.map(tag => (
                <div key={tag.id} className="admin-tag-pill">
                  <span style={{ fontSize: '13px', color: 'var(--ink-2)', fontWeight: 500 }}>
                    {tag.name}
                  </span>
                  <span className="admin-tag-count">{tag._count.articles}</span>
                  <div className="admin-tag-actions">
                    <button
                      className="admin-tag-action"
                      title={`Edit "${tag.name}"`}
                      onClick={() => openEdit(tag)}
                    >
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path
                          d="M8.5 1.5a1.414 1.414 0 0 1 2 2L3.5 10.5l-2.5.5.5-2.5L8.5 1.5Z"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      className={cn('admin-tag-action', 'danger')}
                      title={`Delete "${tag.name}"`}
                      onClick={() => setDeleteTarget(tag)}
                    >
                      <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                        <path
                          d="M1 1l8 8M9 1l-8 8"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Create / Edit modal */}
      {modalOpen && (
        <AdminModal
          title={modalMode === 'create' ? 'New Tag' : `Edit — ${form.name || 'Tag'}`}
          onClose={closeModal}
          footer={
            <>
              <button className="admin-btn-ghost" onClick={closeModal} disabled={saving}>
                Cancel
              </button>
              <button className="admin-btn-ink" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : modalMode === 'create' ? 'Create' : 'Save changes'}
              </button>
            </>
          }
        >
          {formError && (
            <div className="admin-error" style={{ marginBottom: 14 }}>{formError}</div>
          )}

          <div className="admin-form-row">
            <label className="admin-form-label">Name *</label>
            <input
              className="admin-form-input"
              value={form.name}
              onChange={e => setField('name', e.target.value)}
              placeholder="e.g. Earnings"
              autoFocus
            />
          </div>

          <div className="admin-form-row" style={{ marginBottom: 0 }}>
            <label className="admin-form-label">Slug *</label>
            <input
              className="admin-form-input"
              value={form.slug}
              onChange={e => setField('slug', e.target.value)}
              placeholder="e.g. earnings"
            />
          </div>
        </AdminModal>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <AdminModal
          title="Delete tag?"
          onClose={() => !deleting && setDeleteTarget(null)}
          footer={
            <>
              <button
                className="admin-btn-ghost"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="admin-btn-danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </>
          }
        >
          {deleteTarget._count.articles > 0 && (
            <div className="admin-error" style={{ marginBottom: 14 }}>
              This tag is used by {deleteTarget._count.articles} article{deleteTarget._count.articles !== 1 ? 's' : ''}.
              Deleting it will remove the tag from those articles.
            </div>
          )}
          <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}>
            Are you sure you want to delete{' '}
            <strong style={{ color: 'var(--ink)' }}>{deleteTarget.name}</strong>?
            This action cannot be undone.
          </p>
        </AdminModal>
      )}

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
=======
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
>>>>>>> 8c010c9f9d6ce38ff5baad0c7d77261097047f5a
  )
}

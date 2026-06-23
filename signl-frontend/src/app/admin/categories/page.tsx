'use client'


import { useCallback, useEffect, useRef, useState } from 'react'
import AdminModal from '@/features/admin/shared/AdminModal'
import { cn } from '@/lib/cn'
import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  toggleAdminCategory,
  deleteAdminCategory,
} from '@/services/admin.service'
import type { AdminCategory } from '@/types/admin'

type ToastItem = { id: number; message: string; kind: 'success' | 'error' }
type ModalMode = 'create' | 'edit'

type CategoryForm = {
  name: string
  slug: string
  short: string
  color: string
  description: string
  displayOrder: string
}

const EMPTY_FORM: CategoryForm = {
  name: '',
  slug: '',
  short: '',
  color: '#3b6fd4',
  description: '',
  displayOrder: '0',
}

function toSlug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function toShort(slug: string): string {
  return slug.replace(/-/g, '').slice(0, 4)
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const [modalMode, setModalMode] = useState<ModalMode>('create')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<CategoryForm>(EMPTY_FORM)
  const [slugTouched, setSlugTouched] = useState(false)
  const [shortTouched, setShortTouched] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [togglingId, setTogglingId] = useState<string | null>(null)

  const [toasts, setToasts] = useState<ToastItem[]>([])
  const toastId = useRef(0)

  function showToast(message: string, kind: 'success' | 'error' = 'success') {
    const id = ++toastId.current
    setToasts(prev => [...prev, { id, message, kind }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200)
  }

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAdminCategories()
      setCategories(data.slice().sort((a, b) => a.displayOrder - b.displayOrder))
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }; message?: string }
      setError(err?.response?.data?.message ?? err?.message ?? 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  function setField(key: keyof CategoryForm, value: string) {
    if (key === 'slug') setSlugTouched(true)
    if (key === 'short') setShortTouched(true)
    setForm(prev => {
      const next = { ...prev, [key]: value }
      if (key === 'name') {
        const slug = toSlug(value)
        if (!slugTouched) next.slug = slug
        if (!shortTouched) next.short = toShort(slug)
      }
      return next
    })
  }

  function openCreate() {
    setModalMode('create')
    setEditingId(null)
    setForm(EMPTY_FORM)
    setSlugTouched(false)
    setShortTouched(false)
    setFormError(null)
    setModalOpen(true)
  }

  function openEdit(cat: AdminCategory) {
    setModalMode('edit')
    setEditingId(cat.id)
    setForm({
      name: cat.name,
      slug: cat.slug ?? '',
      short: cat.short ?? '',
      color: cat.color ?? '#3b6fd4',
      description: cat.description ?? '',
      displayOrder: String(cat.displayOrder),
    })
    setSlugTouched(true)
    setShortTouched(true)
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
    if (!form.short.trim()) return 'Short code is required'
    if (!/^[a-z0-9]+$/.test(form.short.trim())) return 'Short must be lowercase letters and numbers only'
    const order = Number(form.displayOrder)
    if (isNaN(order) || !Number.isInteger(order)) return 'Display order must be a whole number'
    return null
  }

  async function handleSave() {
    const validationError = validateForm()
    if (validationError) { setFormError(validationError); return }
    setSaving(true)
    setFormError(null)
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      short: form.short.trim(),
      color: form.color || undefined,
      description: form.description.trim() || undefined,
      displayOrder: Number(form.displayOrder),
    }
    try {
      if (modalMode === 'create') {
        await createAdminCategory(payload)
        showToast(`"${payload.name}" created`)
      } else if (editingId) {
        await updateAdminCategory(editingId, payload)
        showToast(`"${payload.name}" updated`)
      }
      closeModal()
      await fetchCategories()
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      setFormError(err?.response?.data?.message ?? 'Failed to save category')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggle(cat: AdminCategory) {
    if (togglingId) return
    setTogglingId(cat.id)
    try {
      await toggleAdminCategory(cat.id)
      showToast(`"${cat.name}" ${cat.active ? 'deactivated' : 'activated'}`)
      await fetchCategories()
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      showToast(err?.response?.data?.message ?? 'Failed to toggle category', 'error')
    } finally {
      setTogglingId(null)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteAdminCategory(deleteTarget.id)
      showToast(`"${deleteTarget.name}" deleted`)
      setDeleteTarget(null)
      await fetchCategories()
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      showToast(err?.response?.data?.message ?? 'Failed to delete category', 'error')
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  const filtered = search.trim()
    ? categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.slug ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (c.short ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : categories

  return (
    <>
      {/* Page header */}
      <div className="admin-page-head">
        <div className="admin-page-head-left">
          <h1 className="admin-page-title">Categories</h1>
          <p className="admin-page-sub">
            Manage content categories — set display order, color coding, and active state.
          </p>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn-sm admin-btn-accent" onClick={openCreate}>
            + New Category
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
            placeholder="Search categories…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Loading */}
        {loading && <div className="admin-loading">Loading categories…</div>}

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
                  <th style={{ width: 40, paddingRight: 0 }}>#</th>
                  <th>Category</th>
                  <th>Slug</th>
                  <th>Short</th>
                  <th className="col-num">Articles</th>
                  <th style={{ width: 120 }}>Status</th>
                  <th className="col-actions" style={{ width: 130 }} />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="admin-empty" style={{ padding: '48px 20px' }}>
                        {search ? 'No categories match that search' : 'No categories yet'}
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
                    </td>
                  </tr>
                ) : filtered.map(cat => (
                  <tr key={cat.id}>
                    <td style={{
                      fontFamily: 'var(--mono)',
                      fontSize: '11px',
                      color: 'var(--ink-5)',
                      width: 40,
                      paddingRight: 0,
                    }}>
                      {cat.displayOrder}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span
                          className="admin-color-swatch"
                          style={{ background: cat.color ?? '#ccc', flexShrink: 0 }}
                        />
                        <div>
                          <div className="admin-row-title" style={{ fontSize: 13 }}>{cat.name}</div>
                          {cat.description && (
                            <div className="admin-row-meta" style={{ marginTop: 1 }}>
                              {cat.description.length > 64
                                ? cat.description.slice(0, 64) + '…'
                                : cat.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '11.5px', color: 'var(--ink-4)' }}>
                      {cat.slug ?? <span style={{ color: 'var(--ink-5)' }}>—</span>}
                    </td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '11.5px', color: 'var(--ink-4)' }}>
                      {cat.short ?? <span style={{ color: 'var(--ink-5)' }}>—</span>}
                    </td>
                    <td className="col-num">{cat._count.articles}</td>
                    <td>
                      <div
                        className={cn('admin-toggle', cat.active && 'on')}
                        role="switch"
                        aria-checked={cat.active}
                        onClick={() => handleToggle(cat)}
                        style={{
                          opacity: togglingId === cat.id ? 0.45 : 1,
                          pointerEvents: togglingId ? 'none' : 'auto',
                          userSelect: 'none',
                        }}
                      >
                        <span className="admin-toggle-track">
                          <span className="admin-toggle-thumb" />
                        </span>
                        <span className="admin-toggle-label">
                          {cat.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="col-actions" style={{ width: 130 }}>
                      <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
                        <button
                          className="admin-btn-sm"
                          style={{ height: '26px', fontSize: '11px', padding: '0 10px' }}
                          onClick={() => openEdit(cat)}
                        >
                          Edit
                        </button>
                        <button
                          className="admin-btn-sm"
                          style={{
                            height: '26px',
                            fontSize: '11px',
                            padding: '0 10px',
                            color: 'var(--accent)',
                          }}
                          onClick={() => setDeleteTarget(cat)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit modal */}
      {modalOpen && (
        <AdminModal
          title={modalMode === 'create' ? 'New Category' : `Edit — ${form.name || 'Category'}`}
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
              placeholder="e.g. Markets"
              autoFocus
            />
          </div>

          <div className="admin-form-grid-2">
            <div className="admin-form-row">
              <label className="admin-form-label">Slug *</label>
              <input
                className="admin-form-input"
                value={form.slug}
                onChange={e => setField('slug', e.target.value)}
                placeholder="e.g. markets"
              />
            </div>
            <div className="admin-form-row">
              <label className="admin-form-label">Short *</label>
              <input
                className="admin-form-input"
                value={form.short}
                onChange={e => setField('short', e.target.value)}
                placeholder="e.g. mkt"
                maxLength={8}
              />
            </div>
          </div>

          <div className="admin-form-grid-2">
            <div className="admin-form-row">
              <label className="admin-form-label">Color</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="color"
                  value={form.color}
                  onChange={e => setField('color', e.target.value)}
                  style={{
                    width: 34,
                    height: 34,
                    padding: 2,
                    border: '1px solid var(--admin-border)',
                    borderRadius: 6,
                    cursor: 'pointer',
                    background: 'none',
                    flexShrink: 0,
                  }}
                />
                <input
                  className="admin-form-input"
                  value={form.color}
                  onChange={e => setField('color', e.target.value)}
                  placeholder="#3b6fd4"
                  style={{ flex: 1 }}
                />
              </div>
            </div>
            <div className="admin-form-row">
              <label className="admin-form-label">Display Order</label>
              <input
                className="admin-form-input"
                type="number"
                value={form.displayOrder}
                onChange={e => setField('displayOrder', e.target.value)}
                placeholder="0"
                min={0}
                step={1}
              />
            </div>
          </div>

          <div className="admin-form-row" style={{ marginBottom: 0 }}>
            <label className="admin-form-label">Description</label>
            <textarea
              className="admin-form-textarea"
              value={form.description}
              onChange={e => setField('description', e.target.value)}
              placeholder="Brief description of this category…"
              rows={2}
            />
          </div>
        </AdminModal>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <AdminModal
          title="Delete category?"
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
              This category has {deleteTarget._count.articles} article{deleteTarget._count.articles !== 1 ? 's' : ''}.
              Reassign them before deleting, or the operation may fail.
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

  )
}

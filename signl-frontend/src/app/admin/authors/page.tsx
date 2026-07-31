'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import AdminModal from '@/features/admin/shared/AdminModal'
import { cn } from '@/lib/cn'
import { getAdminAuthors, updateAdminAuthor } from '@/services/admin.service'
import type { AdminAuthor } from '@/types/admin'

const AVATAR_COLORS = [
  '#3b6fd4',
  '#2e8b5a',
  '#b87c2a',
  '#7b4fa6',
  '#b8392b',
]

function avatarColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length]
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')
}

function formatJoined(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
}

type ToastItem = { id: number; message: string; kind: 'success' | 'error' }

type EditForm = {
  name: string
  title: string
  slug: string
  bio: string
  twitter: string
  linkedin: string
}

const EMPTY_FORM: EditForm = { name: '', title: '', slug: '', bio: '', twitter: '', linkedin: '' }

export default function AdminAuthorsPage() {
  const [authors, setAuthors] = useState<AdminAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [editingAuthor, setEditingAuthor] = useState<AdminAuthor | null>(null)
  const [form, setForm] = useState<EditForm>(EMPTY_FORM)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [toasts, setToasts] = useState<ToastItem[]>([])
  const toastId = useRef(0)

  function showToast(message: string, kind: 'success' | 'error' = 'success') {
    const id = ++toastId.current
    setToasts(prev => [...prev, { id, message, kind }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200)
  }

  const fetchAuthors = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAdminAuthors()
      setAuthors(data)
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }; message?: string }
      setError(err?.response?.data?.message ?? err?.message ?? 'Failed to load authors')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAuthors() }, [fetchAuthors])

  function openEdit(author: AdminAuthor) {
    setEditingAuthor(author)
    setForm({
      name: author.name,
      title: author.title ?? '',
      slug: author.slug ?? '',
      bio: author.bio ?? '',
      twitter: author.twitter ?? '',
      linkedin: author.linkedin ?? '',
    })
    setFormError(null)
  }

  function closeEdit() {
    setEditingAuthor(null)
    setForm(EMPTY_FORM)
    setFormError(null)
  }

  function setField(key: keyof EditForm, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    if (!editingAuthor) return
    if (!form.name.trim()) {
      setFormError('Name is required')
      return
    }
    setSaving(true)
    setFormError(null)
    try {
      await updateAdminAuthor(editingAuthor.id, {
        name: form.name.trim(),
        title: form.title.trim() || undefined,
        slug: form.slug.trim() || undefined,
        bio: form.bio.trim() || undefined,
        twitter: form.twitter.trim() || undefined,
        linkedin: form.linkedin.trim() || undefined,
      })
      showToast(`${form.name.trim()} updated`)
      closeEdit()
      await fetchAuthors()
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      setFormError(err?.response?.data?.message ?? 'Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {/* Page header */}
      <div className="admin-page-head">
        <div className="admin-page-head-left">
          <h1 className="admin-page-title">Authors</h1>
          <p className="admin-page-sub">
            All editors on Signl. Click Edit to update a profile — name, title, bio, and social links.
          </p>
        </div>
      </div>

      {/* Main card */}
      <div className="admin-card-new">

        {/* Loading */}
        {loading && <div className="admin-loading">Loading authors…</div>}

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
                  <th>Author</th>
                  <th>Title</th>
                  <th className="col-num">Articles</th>
                  <th>Member since</th>
                  <th className="col-actions" />
                </tr>
              </thead>
              <tbody>
                {authors.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="admin-empty" style={{ padding: '48px 20px' }}>
                        No editors found
                      </div>
                    </td>
                  </tr>
                ) : authors.map((author, i) => (
                  <tr key={author.id}>
                    <td>
                      <div className="admin-user-cell">
                        {author.avatar ? (
                          <Image
                            src={author.avatar}
                            alt={author.name}
                            width={32}
                            height={32}
                            unoptimized
                            style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                          />
                        ) : (
                          <div
                            className="admin-avatar"
                            style={{ background: avatarColor(i) }}
                          >
                            {initials(author.name)}
                          </div>
                        )}
                        <div>
                          <div className="admin-user-name">{author.name}</div>
                          <div className="admin-user-email">{author.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '13px', color: 'var(--ink-3)' }}>
                      {author.title ?? <span style={{ color: 'var(--ink-5)' }}>—</span>}
                    </td>
                    <td className="col-num">{author._count.authoredArticles}</td>
                    <td>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--ink-4)' }}>
                        {formatJoined(author.createdAt)}
                      </span>
                    </td>
                    <td className="col-actions">
                      <button
                        className="admin-btn-sm"
                        style={{ height: '26px', fontSize: '11px', padding: '0 10px' }}
                        onClick={() => openEdit(author)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editingAuthor && (
        <AdminModal
          title={`Edit — ${editingAuthor.name}`}
          onClose={closeEdit}
          footer={
            <>
              <button className="admin-btn-ghost" onClick={closeEdit} disabled={saving}>
                Cancel
              </button>
              <button className="admin-btn-ink" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </>
          }
        >
          {/* Author stats header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '0 0 18px',
            borderBottom: '1px solid var(--admin-border)',
            marginBottom: 18,
          }}>
            <div
              className="admin-avatar"
              style={{
                width: 44,
                height: 44,
                fontSize: 15,
                background: avatarColor(authors.indexOf(editingAuthor)),
              }}
            >
              {initials(editingAuthor.name)}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>
                {editingAuthor.email}
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--ink-4)', marginTop: 2 }}>
                {editingAuthor._count.authoredArticles} article{editingAuthor._count.authoredArticles !== 1 ? 's' : ''}
                {' · '}
                Joined {formatJoined(editingAuthor.createdAt)}
              </div>
            </div>
          </div>

          {formError && (
            <div className="admin-error" style={{ marginBottom: 14 }}>{formError}</div>
          )}

          <div className="admin-form-row">
            <label className="admin-form-label">Name *</label>
            <input
              className="admin-form-input"
              value={form.name}
              onChange={e => setField('name', e.target.value)}
              placeholder="Full name"
            />
          </div>

          <div className="admin-form-grid-2">
            <div className="admin-form-row">
              <label className="admin-form-label">Title</label>
              <input
                className="admin-form-input"
                value={form.title}
                onChange={e => setField('title', e.target.value)}
                placeholder="e.g. Senior Markets Editor"
              />
            </div>
            <div className="admin-form-row">
              <label className="admin-form-label">URL slug</label>
              <input
                className="admin-form-input"
                value={form.slug}
                onChange={e => setField('slug', e.target.value)}
                placeholder="e.g. priya-sharma"
              />
            </div>
          </div>

          <div className="admin-form-row">
            <label className="admin-form-label">Bio</label>
            <textarea
              className="admin-form-textarea"
              value={form.bio}
              onChange={e => setField('bio', e.target.value)}
              placeholder="Short author bio…"
              rows={3}
            />
          </div>

          <div className="admin-form-grid-2">
            <div className="admin-form-row" style={{ marginBottom: 0 }}>
              <label className="admin-form-label">Twitter / X</label>
              <input
                className="admin-form-input"
                value={form.twitter}
                onChange={e => setField('twitter', e.target.value)}
                placeholder="@handle"
              />
            </div>
            <div className="admin-form-row" style={{ marginBottom: 0 }}>
              <label className="admin-form-label">LinkedIn</label>
              <input
                className="admin-form-input"
                value={form.linkedin}
                onChange={e => setField('linkedin', e.target.value)}
                placeholder="linkedin.com/in/…"
              />
            </div>
          </div>
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

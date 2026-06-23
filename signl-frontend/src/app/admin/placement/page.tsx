'use client'

<<<<<<< HEAD
import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import AdminModal from '@/features/admin/shared/AdminModal'
import {
  getAdminPlacements,
  createAdminPlacement,
  updateAdminPlacement,
  deleteAdminPlacement,
  getArticles,
} from '@/services/admin.service'
import type { AdminPlacement, AdminArticle } from '@/types/admin'

type ToastItem = { id: number; message: string; kind: 'success' | 'error' }

const SECTIONS = [
  { key: 'hero',          label: 'Hero',           sub: 'Primary spotlight — top of homepage' },
  { key: 'featured',      label: 'Featured',        sub: 'Highlighted articles grid' },
  { key: 'editors-picks', label: "Editor's Picks",  sub: 'Curated recommendations' },
] as const

type SectionKey = typeof SECTIONS[number]['key']

function sectionPlacements(all: AdminPlacement[], section: SectionKey): AdminPlacement[] {
  return all
    .filter(p => p.section === section)
    .sort((a, b) => a.priority - b.priority)
}

export default function AdminPlacementPage() {
  const [placements, setPlacements] = useState<AdminPlacement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Add article modal state
  const [addModal, setAddModal] = useState<{ open: false } | { open: true; section: SectionKey }>({ open: false })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<AdminArticle[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Remove confirm modal
  const [removeTarget, setRemoveTarget] = useState<AdminPlacement | null>(null)
  const [removing, setRemoving] = useState(false)

  // Toggle in-flight tracking
  const [togglingId, setTogglingId] = useState<string | null>(null)

  // Priority edit tracking: placementId → draft value
  const [priorityDraft, setPriorityDraft] = useState<Record<string, string>>({})

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const toastCounter = useRef(0)

  function addToast(message: string, kind: 'success' | 'error') {
    const id = ++toastCounter.current
    setToasts(prev => [...prev, { id, message, kind }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200)
  }

  const fetchPlacements = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setPlacements(await getAdminPlacements())
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }; message?: string }
      setError(err?.response?.data?.message ?? err?.message ?? 'Failed to load placements')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPlacements() }, [fetchPlacements])

  // Article search with debounce
  useEffect(() => {
    if (!addModal.open) return
    if (searchTimer.current) clearTimeout(searchTimer.current)
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    searchTimer.current = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const result = await getArticles({ status: 'PUBLISHED', search: searchQuery, page: 1, limit: 8 })
        setSearchResults(result.articles)
      } catch {
        setSearchResults([])
      } finally {
        setSearchLoading(false)
      }
    }, 350)
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current) }
  }, [searchQuery, addModal.open])

  function openAddModal(section: SectionKey) {
    setSearchQuery('')
    setSearchResults([])
    setAddModal({ open: true, section })
  }

  function closeAddModal() {
    setAddModal({ open: false })
    setSearchQuery('')
    setSearchResults([])
  }

  async function handleAddArticle(article: AdminArticle) {
    if (!addModal.open) return
    const section = addModal.section
    // Check already placed
    const already = placements.some(p => p.articleId === article.id && p.section === section)
    if (already) {
      addToast('This article is already in this section', 'error')
      return
    }
    const nextPriority = sectionPlacements(placements, section).length
    try {
      const created = await createAdminPlacement({ articleId: article.id, section, priority: nextPriority })
      setPlacements(prev => [...prev, created])
      addToast(`"${article.title}" added to ${SECTIONS.find(s => s.key === section)?.label}`, 'success')
      closeAddModal()
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }; message?: string }
      addToast(err?.response?.data?.message ?? err?.message ?? 'Failed to add article', 'error')
    }
  }

  async function handleToggle(placement: AdminPlacement) {
    if (togglingId) return
    setTogglingId(placement.id)
    try {
      const updated = await updateAdminPlacement(placement.id, { active: !placement.active })
      setPlacements(prev => prev.map(p => p.id === placement.id ? updated : p))
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }; message?: string }
      addToast(err?.response?.data?.message ?? err?.message ?? 'Failed to update placement', 'error')
    } finally {
      setTogglingId(null)
    }
  }

  async function handlePriorityBlur(placement: AdminPlacement) {
    const raw = priorityDraft[placement.id]
    if (raw === undefined) return
    const parsed = parseInt(raw, 10)
    if (isNaN(parsed) || parsed === placement.priority) {
      setPriorityDraft(prev => { const n = { ...prev }; delete n[placement.id]; return n })
      return
    }
    try {
      const updated = await updateAdminPlacement(placement.id, { priority: parsed })
      setPlacements(prev => prev.map(p => p.id === placement.id ? updated : p))
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }; message?: string }
      addToast(err?.response?.data?.message ?? err?.message ?? 'Failed to update priority', 'error')
    } finally {
      setPriorityDraft(prev => { const n = { ...prev }; delete n[placement.id]; return n })
    }
  }

  async function handleRemove() {
    if (!removeTarget) return
    setRemoving(true)
    try {
      await deleteAdminPlacement(removeTarget.id)
      setPlacements(prev => prev.filter(p => p.id !== removeTarget.id))
      addToast('Placement removed', 'success')
      setRemoveTarget(null)
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }; message?: string }
      addToast(err?.response?.data?.message ?? err?.message ?? 'Failed to remove placement', 'error')
    } finally {
      setRemoving(false)
    }
  }

  const alreadyInSection = addModal.open
    ? new Set(placements.filter(p => p.section === addModal.section).map(p => p.articleId))
    : new Set<string>()

  return (
    <>
      {/* Toasts */}
      <div className="admin-toast-stack">
        {toasts.map(t => (
          <div key={t.id} className={cn('admin-toast', t.kind === 'error' && 'admin-toast-error')}>
            {t.message}
          </div>
        ))}
      </div>

      {/* Page header */}
      <div className="admin-page-head">
        <div className="admin-page-head-left">
          <h1 className="admin-page-title">Hero &amp; Placement</h1>
          <p className="admin-page-sub">
            Control which articles appear in each homepage section.
          </p>
        </div>
      </div>

      {loading && <div className="admin-loading">Loading placements…</div>}
      {!loading && error && <div className="admin-error">{error}</div>}

      {!loading && !error && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          alignItems: 'start',
        }}>
          {SECTIONS.map(section => {
            const items = sectionPlacements(placements, section.key)
            return (
              <div key={section.key} className="admin-card-new">
                <div className="admin-card-head" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span className="admin-card-title">{section.label}</span>
                    <span style={{
                      fontSize: 11,
                      fontFamily: 'var(--mono)',
                      color: 'var(--ink-5)',
                      background: 'var(--surface-2)',
                      borderRadius: 4,
                      padding: '1px 7px',
                    }}>
                      {items.length}
                    </span>
                  </div>
                  <span className="admin-card-title-meta" style={{ marginTop: 0 }}>{section.sub}</span>
                </div>

                <div>
                  {items.length === 0 ? (
                    <div className="admin-empty" style={{ padding: '28px 20px', fontSize: 12 }}>
                      No articles placed here
                    </div>
                  ) : (
                    items.map(placement => (
                      <div
                        key={placement.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '10px 16px',
                          borderBottom: '1px solid var(--line)',
                          opacity: placement.active ? 1 : 0.55,
                        }}
                      >
                        {/* Priority */}
                        <input
                          type="number"
                          value={priorityDraft[placement.id] ?? placement.priority}
                          onChange={e => setPriorityDraft(prev => ({ ...prev, [placement.id]: e.target.value }))}
                          onBlur={() => handlePriorityBlur(placement)}
                          onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
                          title="Priority (lower = higher on page)"
                          style={{
                            width: 36,
                            textAlign: 'center',
                            fontSize: 11,
                            fontFamily: 'var(--mono)',
                            padding: '2px 4px',
                            border: '1px solid var(--line)',
                            borderRadius: 4,
                            background: 'var(--surface-2)',
                            color: 'var(--ink-2)',
                            flexShrink: 0,
                          }}
                        />

                        {/* Article info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            className="admin-row-title"
                            style={{ fontSize: 12, lineHeight: '1.3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                            title={placement.article.title}
                          >
                            {placement.article.title}
                          </div>
                          <div className="admin-row-meta" style={{ marginTop: 1, fontSize: 10 }}>
                            <span>{placement.article.category.name}</span>
                            <span>·</span>
                            <span>{placement.article.author.name}</span>
                          </div>
                        </div>

                        {/* Active toggle */}
                        <button
                          className={cn(
                            'admin-status-pill',
                            placement.active ? 'status-published' : 'status-archived',
                          )}
                          style={{ fontSize: 10, padding: '2px 7px', cursor: 'pointer', border: 'none', flexShrink: 0 }}
                          onClick={() => handleToggle(placement)}
                          disabled={togglingId === placement.id}
                          title={placement.active ? 'Click to deactivate' : 'Click to activate'}
                        >
                          {placement.active ? 'Active' : 'Off'}
                        </button>

                        {/* Remove */}
                        <button
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--ink-5)',
                            fontSize: 15,
                            lineHeight: 1,
                            padding: '2px 4px',
                            borderRadius: 4,
                            flexShrink: 0,
                          }}
                          onClick={() => setRemoveTarget(placement)}
                          title="Remove placement"
                          onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-5)')}
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div style={{ padding: '12px 16px' }}>
                  <button
                    className="admin-btn-sm"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => openAddModal(section.key)}
                  >
                    + Add Article
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add article modal */}
      {addModal.open && (
        <AdminModal
          title={`Add to ${SECTIONS.find(s => s.key === addModal.section)?.label}`}
          onClose={closeAddModal}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              className="admin-form-input"
              type="text"
              placeholder="Search published articles…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
            />

            {searchLoading && (
              <div style={{ fontSize: 12, color: 'var(--ink-5)', textAlign: 'center', padding: '12px 0' }}>
                Searching…
              </div>
            )}

            {!searchLoading && searchQuery && searchResults.length === 0 && (
              <div style={{ fontSize: 12, color: 'var(--ink-5)', textAlign: 'center', padding: '12px 0' }}>
                No published articles found
              </div>
            )}

            {!searchLoading && !searchQuery && (
              <div style={{ fontSize: 12, color: 'var(--ink-5)', textAlign: 'center', padding: '12px 0' }}>
                Type to search published articles
              </div>
            )}

            {!searchLoading && searchResults.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 360, overflowY: 'auto' }}>
                {searchResults.map(article => {
                  const placed = alreadyInSection.has(article.id)
                  return (
                    <button
                      key={article.id}
                      disabled={placed}
                      onClick={() => handleAddArticle(article)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: 2,
                        padding: '10px 12px',
                        border: '1px solid var(--line)',
                        borderRadius: 6,
                        background: placed ? 'var(--surface-2)' : 'transparent',
                        cursor: placed ? 'not-allowed' : 'pointer',
                        textAlign: 'left',
                        width: '100%',
                        opacity: placed ? 0.5 : 1,
                      }}
                    >
                      <span style={{
                        fontSize: 13,
                        color: 'var(--ink-1)',
                        fontFamily: 'var(--sans)',
                        lineHeight: '1.3',
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '100%',
                      }}>
                        {article.title}
                        {placed && (
                          <span style={{ marginLeft: 8, fontSize: 10, color: 'var(--ink-5)' }}>already placed</span>
                        )}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--ink-4)', fontFamily: 'var(--mono)' }}>
                        {article.category.name} · {article.author.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </AdminModal>
      )}

      {/* Remove confirm modal */}
      {removeTarget && (
        <AdminModal
          title="Remove placement?"
          onClose={() => setRemoveTarget(null)}
          footer={
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="admin-btn-sm" onClick={() => setRemoveTarget(null)} disabled={removing}>
                Cancel
              </button>
              <button
                className="admin-btn-sm admin-btn-danger"
                onClick={handleRemove}
                disabled={removing}
              >
                {removing ? 'Removing…' : 'Remove'}
              </button>
            </div>
          }
        >
          <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: 0 }}>
            Remove <strong>{removeTarget.article.title}</strong> from the{' '}
            <strong>{SECTIONS.find(s => s.key === removeTarget.section)?.label}</strong> section?
          </p>
          <p style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 6, marginBottom: 0 }}>
            The article itself is not affected — only its homepage placement is removed.
          </p>
        </AdminModal>
      )}
    </>
=======
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
>>>>>>> 8c010c9f9d6ce38ff5baad0c7d77261097047f5a
  )
}

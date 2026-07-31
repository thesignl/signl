'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import EditorLayout from '@/features/editor/EditorLayout'
import { useEditorGuard } from '@/features/editor/useEditorGuard'
import { useToast } from '@/components/ui/Toast'
import { listNewsletters, createNewsletter } from '@/services/newsletter-admin.service'
import type { NewsletterListItem } from '@/types/newsletter'

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return '—'
  }
}

export default function EditorNewslettersPage() {
  const { ready } = useEditorGuard()
  const router = useRouter()
  const { toast } = useToast()
  const [items, setItems] = useState<NewsletterListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setItems(await listNewsletters())
    } catch {
      toast('Failed to load newsletters.', 'error')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    if (ready) void load()
  }, [ready, load])

  async function handleCreate() {
    setCreating(true)
    try {
      const nl = await createNewsletter({ title: 'Untitled newsletter', subject: '' })
      router.push(`/editor/newsletters/${nl.id}`)
    } catch {
      toast('Could not create newsletter.', 'error')
      setCreating(false)
    }
  }

  if (!ready) return null

  return (
    <EditorLayout activeNav="newsletters" crumbs={[{ label: 'Editor' }, { label: 'Newsletters' }]}>
      <div className="ed-list-page">
        <div className="ed-page-head">
          <div>
            <h1 className="ed-page-title">Newsletters</h1>
            <p className="ed-page-sub">Compose and send newsletters to subscribers.</p>
          </div>
          <div className="ed-page-actions">
            <button className="ed-btn ed-btn-primary ed-btn-sm" onClick={handleCreate} disabled={creating}>
              {creating ? 'Creating…' : '+ New newsletter'}
            </button>
          </div>
        </div>

        {loading ? (
          <p className="ed-page-sub">Loading…</p>
        ) : items.length === 0 ? (
          <div className="ed-card"><div className="ed-empty">No newsletters yet. Create your first.</div></div>
        ) : (
          <div className="ed-card" style={{ padding: 0 }}>
            {items.map((n) => (
              <Link
                key={n.id}
                href={`/editor/newsletters/${n.id}`}
                className="ed-draft-row"
                style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--admin-border, #eae6dd)' }}
              >
                <div>
                  <div className="ed-draft-headline">{n.title || 'Untitled'}</div>
                  <div className="ed-draft-meta">
                    <span>{n.subject || 'No subject'}</span>
                    <span className="sep">·</span>
                    <span>{n.category?.name ?? 'All subscribers'}</span>
                    <span className="sep">·</span>
                    <span>Updated {fmtDate(n.updatedAt)}</span>
                  </div>
                </div>
                <span className={`nl-status-pill nl-status-${n.status.toLowerCase()}`}>{n.status}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </EditorLayout>
  )
}

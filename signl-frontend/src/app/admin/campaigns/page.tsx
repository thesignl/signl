'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/cn'
import { useToast } from '@/components/ui/Toast'
import {
  listNewsletters,
  listCampaigns,
  createNewsletter,
  deleteNewsletter,
  cancelCampaignSchedule,
} from '@/services/newsletter-admin.service'
import type { CampaignListItem, NewsletterListItem } from '@/types/newsletter'

function fmtDate(iso: string | null): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return '—'
  }
}

function StatusPill({ status }: { status: string }) {
  return <span className={cn('nl-status-pill', `nl-status-${status.toLowerCase()}`)}>{status}</span>
}

export default function AdminCampaignsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [tab, setTab] = useState<'newsletters' | 'campaigns'>('newsletters')
  const [newsletters, setNewsletters] = useState<NewsletterListItem[]>([])
  const [campaigns, setCampaigns] = useState<CampaignListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [nl, cp] = await Promise.all([listNewsletters(), listCampaigns()])
      setNewsletters(nl)
      setCampaigns(cp)
    } catch (e) {
      setError(
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Failed to load campaigns.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function handleCreate() {
    setCreating(true)
    try {
      const nl = await createNewsletter({ title: 'Untitled newsletter', subject: '' })
      router.push(`/admin/campaigns/${nl.id}`)
    } catch {
      toast('Could not create newsletter.', 'error')
      setCreating(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this newsletter draft? This cannot be undone.')) return
    try {
      await deleteNewsletter(id)
      toast('Deleted.', 'success')
      void load()
    } catch (e) {
      toast(
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Delete failed.',
        'error',
      )
    }
  }

  async function handleCancel(id: string) {
    if (!confirm('Cancel this scheduled campaign?')) return
    try {
      await cancelCampaignSchedule(id)
      toast('Schedule cancelled.', 'success')
      void load()
    } catch {
      toast('Could not cancel.', 'error')
    }
  }

  return (
    <>
      <div className="admin-page-head">
        <div className="admin-page-head-left">
          <h1 className="admin-page-title">Campaigns</h1>
          <p className="admin-page-sub">Compose, schedule, and send newsletters.</p>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn-primary" onClick={handleCreate} disabled={creating}>
            {creating ? 'Creating…' : '+ New newsletter'}
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={cn('admin-tab', tab === 'newsletters' && 'active')}
          onClick={() => setTab('newsletters')}
        >
          Newsletters ({newsletters.length})
        </button>
        <button
          className={cn('admin-tab', tab === 'campaigns' && 'active')}
          onClick={() => setTab('campaigns')}
        >
          Sent & scheduled ({campaigns.length})
        </button>
      </div>

      <div className="admin-card-new">
        {loading && <div className="admin-loading">Loading…</div>}
        {!loading && error && <div style={{ padding: 20 }}><div className="admin-error">{error}</div></div>}

        {!loading && !error && tab === 'newsletters' && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th style={{ width: 140 }}>Type</th>
                  <th style={{ width: 110 }}>Status</th>
                  <th style={{ width: 140 }}>Updated</th>
                  <th style={{ width: 120 }}></th>
                </tr>
              </thead>
              <tbody>
                {newsletters.length === 0 ? (
                  <tr><td colSpan={5}><div className="admin-empty" style={{ padding: '48px 20px' }}>No newsletters yet. Create your first.</div></td></tr>
                ) : newsletters.map((n) => (
                  <tr key={n.id}>
                    <td>
                      <Link href={`/admin/campaigns/${n.id}`} className="admin-row-title" style={{ color: 'var(--ink-1)' }}>
                        {n.title || 'Untitled'}
                      </Link>
                      <div className="admin-row-meta"><span>{n.subject || 'No subject'}</span></div>
                    </td>
                    <td>{n.category?.name ?? '—'}</td>
                    <td><StatusPill status={n.status} /></td>
                    <td><span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-4)' }}>{fmtDate(n.updatedAt)}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link href={`/admin/campaigns/${n.id}`} className="admin-btn-sm">Edit</Link>
                        <button className="admin-btn-sm" onClick={() => handleDelete(n.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && tab === 'campaigns' && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th style={{ width: 100 }}>Status</th>
                  <th style={{ width: 90 }}>Sent</th>
                  <th style={{ width: 90 }}>Opens</th>
                  <th style={{ width: 90 }}>Clicks</th>
                  <th style={{ width: 90 }}>Bounces</th>
                  <th style={{ width: 150 }}>When</th>
                  <th style={{ width: 90 }}></th>
                </tr>
              </thead>
              <tbody>
                {campaigns.length === 0 ? (
                  <tr><td colSpan={8}><div className="admin-empty" style={{ padding: '48px 20px' }}>No campaigns sent yet.</div></td></tr>
                ) : campaigns.map((c) => {
                  const openRate = c.sentCount > 0 ? Math.round((c.openCount / c.sentCount) * 100) : 0
                  const clickRate = c.sentCount > 0 ? Math.round((c.clickCount / c.sentCount) * 100) : 0
                  return (
                    <tr key={c.id}>
                      <td>
                        <div className="admin-row-title">{c.subject}</div>
                        <div className="admin-row-meta"><span>{c.newsletter?.title ?? ''}</span></div>
                      </td>
                      <td><StatusPill status={c.status} /></td>
                      <td>{c.sentCount}/{c.totalRecipients}</td>
                      <td>{c.openCount} <span style={{ color: 'var(--ink-4)', fontSize: 11 }}>({openRate}%)</span></td>
                      <td>{c.clickCount} <span style={{ color: 'var(--ink-4)', fontSize: 11 }}>({clickRate}%)</span></td>
                      <td>{c.bounceCount}</td>
                      <td>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-4)' }}>
                          {c.status === 'SCHEDULED' ? fmtDate(c.scheduledAt) : fmtDate(c.completedAt ?? c.createdAt)}
                        </span>
                      </td>
                      <td>
                        {c.status === 'SCHEDULED' && (
                          <button className="admin-btn-sm" onClick={() => handleCancel(c.id)}>Cancel</button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

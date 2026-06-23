'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import AdminModal from '@/features/admin/shared/AdminModal'
import { cn } from '@/lib/cn'
import { useAuthStore } from '@/store/auth.store'
import { getUsers, updateRole, deleteUser } from '@/services/admin.service'
import type { AdminUser } from '@/types/admin'

const LIMIT = 20

const AVATAR_COLORS = ['#3b6fd4', '#2e8b5a', '#b87c2a', '#7b4fa6', '#b8392b']

function avatarColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length]
}

function initials(name: string): string {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

function formatJoined(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

const ROLE_META: Record<string, { label: string; bg: string; color: string }> = {
  ADMIN:  { label: 'Admin',  bg: 'var(--accent-amber-soft)', color: 'var(--accent-amber)' },
  EDITOR: { label: 'Editor', bg: 'var(--accent-green-soft)', color: 'var(--accent-green)' },
  USER:   { label: 'User',   bg: 'var(--paper-2)',           color: 'var(--ink-4)' },
}

type ToastItem = { id: number; message: string; kind: 'success' | 'error' }

export default function AdminUsersPage() {
  const currentUser = useAuthStore(s => s.user)

  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [changingRoleId, setChangingRoleId] = useState<string | null>(null)

  const [toasts, setToasts] = useState<ToastItem[]>([])
  const toastId = useRef(0)

  function showToast(message: string, kind: 'success' | 'error' = 'success') {
    const id = ++toastId.current
    setToasts(prev => [...prev, { id, message, kind }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200)
  }

  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1) }, 350)
    return () => clearTimeout(t)
  }, [searchInput])

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setUsers(await getUsers())
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }; message?: string }
      setError(err?.response?.data?.message ?? err?.message ?? 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  async function handleRoleChange(user: AdminUser, role: string) {
    if (changingRoleId) return
    setChangingRoleId(user.id)
    try {
      await updateRole(user.id, role)
      showToast(`${user.name} is now ${ROLE_META[role]?.label ?? role}`)
      await fetchUsers()
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      showToast(err?.response?.data?.message ?? 'Failed to change role', 'error')
    } finally {
      setChangingRoleId(null)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteUser(deleteTarget.id)
      showToast(`${deleteTarget.name} removed`)
      setDeleteTarget(null)
      await fetchUsers()
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      showToast(err?.response?.data?.message ?? 'Failed to remove user', 'error')
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  const filtered = search.trim()
    ? users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      )
    : users

  const total = filtered.length
  const totalPages = Math.ceil(total / LIMIT)
  const pageStart = total === 0 ? 0 : (page - 1) * LIMIT + 1
  const pageEnd = Math.min(page * LIMIT, total)
  const paged = filtered.slice((page - 1) * LIMIT, page * LIMIT)

  return (
    <>
      {/* Page header */}
      <div className="admin-page-head">
        <div className="admin-page-head-left">
          <h1 className="admin-page-title">Users</h1>
          <p className="admin-page-sub">
            {!loading && `${users.length.toLocaleString()} user${users.length !== 1 ? 's' : ''} — `}
            Manage roles and remove accounts.
          </p>
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
            placeholder="Search by name or email…"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
        </div>

        {/* Loading */}
        {loading && <div className="admin-loading">Loading users…</div>}

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
                  <th>User</th>
                  <th style={{ width: 140 }}>Role</th>
                  <th style={{ width: 140 }}>Joined</th>
                  <th className="col-actions" />
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="admin-empty" style={{ padding: '48px 20px' }}>
                        {search ? 'No users match that search' : 'No users found'}
                        {search && (
                          <button
                            onClick={() => { setSearchInput(''); setSearch('') }}
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
                ) : paged.map(user => {
                  const isSelf = user.id === currentUser?.id
                  const isChanging = changingRoleId === user.id
                  const roleMeta = ROLE_META[user.role] ?? ROLE_META.USER

                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="admin-user-cell">
                          <div
                            className="admin-avatar"
                            style={{ background: avatarColor(users.indexOf(user)) }}
                          >
                            {initials(user.name)}
                          </div>
                          <div>
                            <div className="admin-user-name">
                              {user.name}
                              {isSelf && (
                                <span style={{
                                  fontFamily: 'var(--mono)',
                                  fontSize: '9px',
                                  fontWeight: 600,
                                  color: 'var(--accent)',
                                  background: 'var(--accent-soft)',
                                  padding: '1px 5px',
                                  borderRadius: '3px',
                                  letterSpacing: '0.06em',
                                  marginLeft: 7,
                                  verticalAlign: 'middle',
                                }}>
                                  YOU
                                </span>
                              )}
                            </div>
                            <div className="admin-user-email">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {isSelf ? (
                          <span style={{
                            display: 'inline-block',
                            padding: '3px 9px',
                            borderRadius: '4px',
                            fontSize: '11.5px',
                            fontWeight: 500,
                            background: roleMeta.bg,
                            color: roleMeta.color,
                          }}>
                            {roleMeta.label}
                          </span>
                        ) : (
                          <select
                            className="admin-form-select"
                            value={user.role}
                            onChange={e => handleRoleChange(user, e.target.value)}
                            disabled={isChanging}
                            style={{
                              fontSize: '12px',
                              padding: '4px 8px',
                              height: 'auto',
                              opacity: isChanging ? 0.5 : 1,
                            }}
                          >
                            <option value="USER">User</option>
                            <option value="EDITOR">Editor</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        )}
                      </td>
                      <td>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--ink-4)' }}>
                          {formatJoined(user.createdAt)}
                        </span>
                      </td>
                      <td className="col-actions">
                        <button
                          className="admin-btn-sm"
                          style={{
                            height: '26px',
                            fontSize: '11px',
                            padding: '0 10px',
                            color: isSelf ? undefined : 'var(--accent)',
                          }}
                          onClick={() => setDeleteTarget(user)}
                          disabled={isSelf}
                          title={isSelf ? 'You cannot delete your own account' : `Remove ${user.name}`}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && total > LIMIT && (
          <div className="admin-pagination">
            <span className="admin-page-info">
              {pageStart}–{pageEnd} of {total} users
            </span>
            <div className="admin-page-controls">
              <button
                className="admin-btn-sm"
                style={{ height: '28px', padding: '0 10px', fontSize: '11.5px' }}
                onClick={() => setPage(p => p - 1)}
                disabled={page <= 1}
              >
                ← Prev
              </button>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--ink-4)', padding: '0 8px' }}>
                {page} / {totalPages}
              </span>
              <button
                className="admin-btn-sm"
                style={{ height: '28px', padding: '0 10px', fontSize: '11.5px' }}
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <AdminModal
          title="Remove user?"
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
                {deleting ? 'Removing…' : 'Remove user'}
              </button>
            </>
          }
        >
          <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}>
            Are you sure you want to remove{' '}
            <strong style={{ color: 'var(--ink)' }}>{deleteTarget.name}</strong>{' '}
            <span style={{ fontFamily: 'var(--mono)', fontSize: '11.5px', color: 'var(--ink-4)' }}>
              ({deleteTarget.email})
            </span>
            ? Their bookmarks and reading history will also be deleted. This cannot be undone.
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

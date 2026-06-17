'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

const CRUMB_LABELS: Record<string, string> = {
  admin: 'Admin',
  articles: 'Articles',
  placement: 'Placement',
  authors: 'Authors',
  users: 'Users',
  categories: 'Categories',
  tags: 'Tags',
  newsletter: 'Newsletter',
  analytics: 'Analytics',
  activity: 'Activity',
  settings: 'Settings',
}

function BellIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 1a5 5 0 00-5 5v3l-1.5 2.5h13L13 9V6a5 5 0 00-5-5z" />
      <path d="M6.5 13.5a1.5 1.5 0 003 0" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="6.5" cy="6.5" r="4.5" />
      <line x1="10.5" y1="10.5" x2="14" y2="14" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="6,4 10,8 6,12" />
    </svg>
  )
}

export default function AdminTopbar() {
  const pathname = usePathname()
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const segments = pathname.split('/').filter(Boolean)
  const currentSegment = segments[segments.length - 1] ?? 'admin'
  const currentLabel = CRUMB_LABELS[currentSegment] ?? currentSegment

  const initials = user?.name
    ? user.name.split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase()
    : 'A'

  function handleLogout() {
    logout()
    router.replace('/login')
  }

  return (
    <header className="admin-topbar">
      <div className="tb-left">
        <nav className="admin-crumb" aria-label="Breadcrumb">
          <span>Admin</span>
          {currentSegment !== 'admin' && (
            <>
              <span className="crumb-sep"><ChevronIcon /></span>
              <span className="crumb-active">{currentLabel}</span>
            </>
          )}
        </nav>

        <div className="admin-search-shell" role="search">
          <SearchIcon />
          <input
            className="admin-search-input"
            type="search"
            placeholder="Search anything…"
            aria-label="Search admin"
          />
          <span className="admin-search-kbd">⌘K</span>
        </div>
      </div>

      <div className="tb-right">
        <button className="tb-icon-btn" aria-label="Notifications">
          <BellIcon />
          <span className="tb-dot" aria-hidden="true" />
        </button>

        <div className="tb-divider" aria-hidden="true" />

        <button className="tb-user" onClick={handleLogout} title="Sign out">
          <div className="tb-avatar" aria-hidden="true">{initials}</div>
          <span className="tb-user-name">{user?.name ?? 'Admin'}</span>
        </button>
      </div>
    </header>
  )
}

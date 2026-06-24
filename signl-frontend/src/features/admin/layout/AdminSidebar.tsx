'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { useAdminUi } from '@/features/admin/layout/adminUi.store'
import { ADMIN_NAV } from '@/features/admin/admin.config'
import { cn } from '@/lib/cn'

/* ── Inline SVG icon set ─────────────────────────────── */
function Icon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    dashboard: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="1" width="6" height="6" rx="1" />
        <rect x="9" y="1" width="6" height="6" rx="1" />
        <rect x="1" y="9" width="6" height="6" rx="1" />
        <rect x="9" y="9" width="6" height="6" rx="1" />
      </svg>
    ),
    articles: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="1" width="12" height="14" rx="1" />
        <line x1="5" y1="5" x2="11" y2="5" />
        <line x1="5" y1="8" x2="11" y2="8" />
        <line x1="5" y1="11" x2="8" y2="11" />
      </svg>
    ),
    placement: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="1" width="14" height="9" rx="1" />
        <rect x="1" y="12" width="6" height="3" rx="1" />
        <rect x="9" y="12" width="6" height="3" rx="1" />
      </svg>
    ),
    authors: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="5" r="3" />
        <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" />
      </svg>
    ),
    users: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="6" cy="5" r="2.5" />
        <path d="M1 14c0-2.761 2.239-4.5 5-4.5s5 1.739 5 4.5" />
        <circle cx="12" cy="5" r="2" />
        <path d="M12 9.5c1.657 0 3 1.343 3 3.5" />
      </svg>
    ),
    categories: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M1 4l2-3h4l2 3" />
        <rect x="1" y="4" width="8" height="10" rx="1" />
        <path d="M10 7l2-3h2l1 3" />
        <rect x="10" y="7" width="5" height="7" rx="1" />
      </svg>
    ),
    tags: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M1 1h6l7 7-6 6-7-7V1z" />
        <circle cx="4.5" cy="4.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
    newsletter: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="3" width="14" height="10" rx="1" />
        <path d="M1 5l7 5 7-5" />
      </svg>
    ),
    analytics: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="1,12 5,7 9,9 15,3" />
        <line x1="1" y1="14" x2="15" y2="14" />
      </svg>
    ),
    activity: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="1,8 4,4 7,10 10,6 13,8 15,7" />
      </svg>
    ),
    settings: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="8" r="2.5" />
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M2.93 2.93l1.41 1.41M11.66 11.66l1.41 1.41M2.93 13.07l1.41-1.41M11.66 4.34l1.41-1.41" />
      </svg>
    ),
  }
  return (
    <span className="sb-icon">
      {icons[name] ?? icons.articles}
    </span>
  )
}

function LogoutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 14H2a1 1 0 01-1-1V3a1 1 0 011-1h4" />
      <polyline points="11,11 15,8 11,5" />
      <line x1="15" y1="8" x2="6" y2="8" />
    </svg>
  )
}

/* ── Component ──────────────────────────────────────── */
export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const sidebarOpen = useAdminUi((s) => s.sidebarOpen)
  const closeSidebar = useAdminUi((s) => s.closeSidebar)

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    closeSidebar()
  }, [pathname, closeSidebar])

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  function handleLogout() {
    logout()
    router.replace('/login')
  }

  const initials = user?.name
    ? user.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
    : 'A'

  return (
    <>
      <div
        className={cn('admin-sidebar-backdrop', sidebarOpen && 'open')}
        onClick={closeSidebar}
        aria-hidden="true"
      />
      <nav
        className={cn('admin-sidebar', sidebarOpen && 'open')}
        aria-label="Admin navigation"
      >
      {/* Brand */}
      <div className="sb-brand">
        <div className="sb-logo-mark">S</div>
        <span className="sb-logo-text">Signl</span>
        <span className="sb-env">Admin</span>
      </div>

      {/* Nav groups */}
      <div className="sb-nav">
        {ADMIN_NAV.map((group) => (
          <div key={group.label} className="sb-group">
            <p className="sb-group-label">{group.label}</p>
            {group.items.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn('sb-link', isActive && 'active')}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon name={item.icon} />
                  {item.label}
                  {item.badge != null && (
                    <span className="sb-count">{item.badge}</span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="sb-footer">
        <div className="sb-avatar" aria-hidden="true">{initials}</div>
        <div className="sb-user-info">
          <div className="sb-user-name">{user?.name ?? 'Admin'}</div>
          <div className="sb-user-role">Administrator</div>
        </div>
        <button
          className="sb-logout-btn"
          onClick={handleLogout}
          title="Sign out"
          aria-label="Sign out"
        >
          <LogoutIcon />
        </button>
      </div>
    </nav>
    </>
  )
}

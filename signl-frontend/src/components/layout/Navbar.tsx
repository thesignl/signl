'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useAuthStore } from '@/store/auth.store'
import { useSearchStore } from '@/store/search.store'
import { useBookmarkStore } from '@/store/bookmark.store'
import { SearchIcon, BookmarkIcon } from '@/components/ui/Icon'

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/analysis', label: 'Analysis' },
  { href: '/learn', label: 'Learn' },
] as const

export default function Navbar() {
  const pathname = usePathname() ?? '/'
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const openSearch = useSearchStore((s) => s.openSearch)
  const bookmarksCount = useBookmarkStore((s) => s.bookmarks.length)
  const [isMac, setIsMac] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // ⌘K / Ctrl+K to open the command palette
  useEffect(() => {
    setIsMac(
      typeof navigator !== 'undefined' &&
        /Mac|iPod|iPhone|iPad/.test(navigator.platform),
    )
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        openSearch()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openSearch])

  // Close the mobile menu on route change.
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const openSaved = () => {
    if (typeof window !== 'undefined' && window.__signl_savedPanel) {
      window.__signl_savedPanel.setOpen(true)
    }
  }

  return (
    <nav className="nav" aria-label="Primary">
      <Link href="/" className="nav-logo" aria-label="Signl home">
        Signl<span>.</span>
      </Link>

      <div className="nav-links">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link"
              aria-current={isActive ? 'page' : undefined}
            >
              {item.label}
            </Link>
          )
        })}
      

      {
        (user?.role === 'EDITOR' || user?.role === 'ADMIN') &&(

          <Link
            href="/editor"
            className="nav-link"
          >
            Editor
          </Link>

        )
      }

      {
        user?.role === 'ADMIN' && (

          <Link
            href="/admin"
            className="nav-link"
          >
            Admin
          </Link>

        )
      }

      </div>


      <div className="nav-right">
        <button
          type="button"
          className="icon-btn"
          onClick={openSearch}
          aria-label="Open search (Press Cmd or Ctrl + K)"
        >
          <SearchIcon size={18} />
          <span className="kbd">{isMac ? '⌘K' : 'Ctrl K'}</span>
        </button>

        {user ? (
          <button
            type="button"
            className="icon-btn"
            onClick={openSaved}
            aria-label={`Saved articles (${bookmarksCount})`}
          >
            <BookmarkIcon size={18} />
            {bookmarksCount > 0 ? (
              <span className="badge-count" aria-hidden>
                {bookmarksCount > 99 ? '99+' : bookmarksCount}
              </span>
            ) : null}
          </button>
        ) : null}

        {user ? (
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={logout}
          >
            Sign out
          </button>
        ) : (
          <>
            <Link href="/login" className="btn btn-sm btn-ghost">
              Sign in
            </Link>
            <Link href="/signup" className="btn btn-sm btn-primary">
              Get started
            </Link>
          </>
        )}

        <button
          type="button"
          className="nav-burger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7">
            {menuOpen ? (
              <>
                <line x1="3" y1="3" x2="13" y2="13" />
                <line x1="13" y1="3" x2="3" y2="13" />
              </>
            ) : (
              <>
                <line x1="2" y1="4" x2="14" y2="4" />
                <line x1="2" y1="8" x2="14" y2="8" />
                <line x1="2" y1="12" x2="14" y2="12" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu — full nav + auth actions, shown ≤1024px */}
      <div
        className={`nav-mobile-backdrop${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <div className={`nav-mobile${menuOpen ? ' open' : ''}`} role="dialog" aria-label="Menu">
        <nav className="nav-mobile-links" aria-label="Mobile primary">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="nav-mobile-link">
              {item.label}
            </Link>
          ))}
          {(user?.role === 'EDITOR' || user?.role === 'ADMIN') && (
            <Link href="/editor" className="nav-mobile-link">Editor</Link>
          )}
          {user?.role === 'ADMIN' && (
            <Link href="/admin" className="nav-mobile-link">Admin</Link>
          )}
        </nav>
        <div className="nav-mobile-actions">
          {user ? (
            <button type="button" className="btn btn-md btn-ghost" onClick={logout}>
              Sign out
            </button>
          ) : (
            <>
              <Link href="/login" className="btn btn-md btn-ghost">Sign in</Link>
              <Link href="/signup" className="btn btn-md btn-primary">Get started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

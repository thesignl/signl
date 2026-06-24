'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import Badge from '@/components/ui/Badge'
import { useAuthStore } from '@/store/auth.store'
import { useSubscriptionStore } from '@/store/subscription.store'
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
  const subPlan = useSubscriptionStore((s) => s.plan)
  const subLoading = useSubscriptionStore((s) => s.loading)
  const openSearch = useSearchStore((s) => s.openSearch)
  const bookmarksCount = useBookmarkStore((s) => s.bookmarks.length)
  const [isMac, setIsMac] = useState(false)

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

        {(user?.role === 'EDITOR' || user?.role === 'ADMIN') && (
          <Link href="/editor" className="nav-link">
            Editor
          </Link>
        )}

        {user?.role === 'ADMIN' && (
          <Link href="/admin" className="nav-link">
            Admin
          </Link>
        )}
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
          <>
            <Link
              href="/account/subscription"
              className="btn btn-sm btn-ghost nav-acct-btn"
            >
              Account
              {!subLoading && subPlan ? (
                <Badge variant={subPlan === 'PRO' ? 'pro' : 'free'}>
                  {subPlan === 'PRO' ? 'Pro' : 'Free'}
                </Badge>
              ) : null}
            </Link>
            <button
              type="button"
              className="btn btn-sm btn-ghost"
              onClick={logout}
            >
              Sign out
            </button>
          </>
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
      </div>
    </nav>
  )
}

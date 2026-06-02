'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import Dialog from '@/components/ui/Dialog'
import EmptyState from '@/components/ui/EmptyState'
import { useBookmarkStore } from '@/store/bookmark.store'
import { useAuthStore } from '@/store/auth.store'

/**
 * Drawer that lists the user's saved articles. Trigger lives in the
 * Navbar — this component listens to a tiny window-level handle so
 * the navbar (which can't import this file without a circular ref)
 * can flip the open state.
 */
export default function SavedPanel() {
  const [open, setOpen] = useState(false)
  const bookmarks = useBookmarkStore((s) => s.bookmarks)
  const user = useAuthStore((s) => s.user)

  // Expose a tiny imperative handle for the navbar trigger.
  useEffect(() => {
    if (typeof window === 'undefined') return
    window.__signl_savedPanel = { open, setOpen }
    return () => {
      if (window.__signl_savedPanel) {
        delete window.__signl_savedPanel
      }
    }
  }, [open])

  if (!user) return null

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      title="Saved articles"
      variant="drawer"
      ariaLabel="Saved articles"
    >
      <div className="dialog-body">
        {bookmarks.length === 0 ? (
          <EmptyState
            title="Nothing saved yet"
            description="Tap the bookmark icon on any story to read it later. Your saved list lives here, across devices."
          />
        ) : (
          <div className="saved-list">
            {bookmarks.map((bookmark) => (
              <Link
                key={bookmark.article.id}
                href={`/article/${bookmark.article.slug}`}
                className="saved-item"
                onClick={() => setOpen(false)}
              >
                <div className="saved-item-tag">
                  {bookmark.article.category?.name ?? 'Article'}
                </div>
                <div className="saved-item-title">
                  {bookmark.article.title}
                </div>
                <div className="saved-item-meta">
                  {bookmark.article.author?.name}
                  {bookmark.article.readTime
                    ? ` · ${bookmark.article.readTime} min read`
                    : ''}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Dialog>
  )
}

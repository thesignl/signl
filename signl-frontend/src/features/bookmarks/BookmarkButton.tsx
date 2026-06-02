'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { saveBookmark, removeBookmark } from '@/services/bookmark.service'
import { useAuthStore } from '@/store/auth.store'
import { useBookmarkStore } from '@/store/bookmark.store'
import { useToast } from '@/components/ui/Toast'
import { BookmarkIcon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import type { Article } from '@/types/article'

interface BookmarkButtonProps {
  article: Article
  /**
   * `default` shows label + icon (story page).
   * `compact` is icon-only (cards).
   */
  variant?: 'default' | 'compact'
}

export default function BookmarkButton({
  article,
  variant = 'default',
}: BookmarkButtonProps) {
  const token = useAuthStore((s) => s.token)
  const { bookmarks, addBookmark, removeBookmark: removeLocal } =
    useBookmarkStore()
  const { toast } = useToast()
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  const exists = bookmarks.some((b) => b.article.id === article.id)

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault()
    e.stopPropagation()

    if (!token) {
      toast('Sign in to save articles.', 'info')
      router.push('/login')
      return
    }

    setBusy(true)
    try {
      if (exists) {
        await removeBookmark(article.id, token)
        removeLocal(article.id)
        toast('Removed from saved.', 'info')
      } else {
        await saveBookmark(article.id, token)
        addBookmark({ article })
        toast('Saved for later.', 'success')
      }
    } catch {
      toast('Could not update saved articles.', 'error')
    } finally {
      setBusy(false)
    }
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        className={cn('bookmark-btn-icon')}
        onClick={handleClick}
        aria-pressed={exists}
        aria-label={exists ? 'Remove from saved' : 'Save for later'}
        disabled={busy}
      >
        <BookmarkIcon size={16} filled={exists} />
      </button>
    )
  }

  return (
    <button
      type="button"
      className="bookmark-btn"
      onClick={handleClick}
      aria-pressed={exists}
      disabled={busy}
    >
      <BookmarkIcon size={14} filled={exists} />
      {exists ? 'Saved' : 'Save'}
    </button>
  )
}

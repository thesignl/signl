'use client'

import { useEffect } from 'react'

import { getBookmarks } from '@/services/bookmark.service'
import { useAuthStore } from '@/store/auth.store'
import { useBookmarkStore } from '@/store/bookmark.store'

export default function useBookmarks() {
  const token = useAuthStore((s) => s.token)
  const setBookmarks = useBookmarkStore((s) => s.setBookmarks)
  const clear = useBookmarkStore((s) => s.clear)

  useEffect(() => {
    if (!token) {
      clear()
      return
    }
    let cancelled = false
    const run = async () => {
      try {
        const data = await getBookmarks(token)
        if (!cancelled) setBookmarks(data ?? [])
      } catch {
        if (!cancelled) setBookmarks([])
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [token, setBookmarks, clear])
}

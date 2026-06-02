'use client'

import { create } from 'zustand'
import type { Bookmark } from '@/types/bookmark'

interface BookmarkStore {
  bookmarks: Bookmark[]
  setBookmarks: (bookmarks: Bookmark[]) => void
  addBookmark: (bookmark: Bookmark) => void
  removeBookmark: (articleId: string) => void
  clear: () => void
}

export const useBookmarkStore = create<BookmarkStore>((set) => ({
  bookmarks: [],
  setBookmarks: (bookmarks) => set({ bookmarks }),
  addBookmark: (bookmark) =>
    set((state) => {
      const exists = state.bookmarks.some(
        (b) => b.article.id === bookmark.article.id,
      )
      if (exists) return state
      return { bookmarks: [bookmark, ...state.bookmarks] }
    }),
  removeBookmark: (articleId) =>
    set((state) => ({
      bookmarks: state.bookmarks.filter(
        (b) => b.article.id !== articleId,
      ),
    })),
  clear: () => set({ bookmarks: [] }),
}))

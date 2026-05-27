'use client'

import { create }
from 'zustand'

interface BookmarkStore {

  bookmarks: any[]

  setBookmarks: (
    bookmarks: any[]
  ) => void

  addBookmark: (
    bookmark: any
  ) => void

  removeBookmark: (
    articleId: string
  ) => void
}

export const useBookmarkStore =
create<BookmarkStore>((set) => ({

  bookmarks: [],

  setBookmarks: (
    bookmarks
  ) => set({

    bookmarks
  }),

  addBookmark: (
    bookmark
  ) => set((state) => ({

    bookmarks: [
      ...state.bookmarks,
      bookmark
    ]
  })),

  removeBookmark: (
    articleId
  ) => set((state) => ({

    bookmarks:
      state.bookmarks.filter(

        (b) =>
          b.article.id !== articleId
      )
  }))
}))
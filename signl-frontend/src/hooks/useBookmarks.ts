'use client'

import { useEffect }
from 'react'

import {
  getBookmarks
}
from '@/services/bookmark.service'

import {
  useAuthStore
}
from '@/store/auth.store'

import {
  useBookmarkStore
}
from '@/store/bookmark.store'

export default function
useBookmarks() {

  const token =
    useAuthStore(
      state => state.token
    )

  const setBookmarks =
    useBookmarkStore(
      state => state.setBookmarks
    )

  useEffect(() => {

    if (!token) return

    const fetchBookmarks =
    async () => {

      try {

        const data =
          await getBookmarks(
            token
          )

        setBookmarks(data)

      } catch {

        console.log(
          'Bookmarks failed'
        )
      }
    }

    fetchBookmarks()

  }, [token])
}
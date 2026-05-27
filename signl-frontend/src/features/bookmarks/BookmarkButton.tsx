'use client'

import {

  saveBookmark,

  removeBookmark

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
import { Article } from '@/types/article'

export default function
BookmarkButton({

  article

}: {

  article: Article
}) {

  const token =
    useAuthStore(
      state => state.token
    )

  const {

    bookmarks,

    addBookmark,

    removeBookmark:
      removeLocal

  } = useBookmarkStore()

  const exists =
    bookmarks.some(

      (b) =>
        b.article.id === article.id
    )

  const handleClick =
  async () => {

    if (!token) {

      alert('Login first')

      return
    }

    try {

      if (exists) {

        await removeBookmark(

          article.id,
          token
        )

        removeLocal(article.id)

      } else {

        await saveBookmark(

          article.id,
          token
        )

        addBookmark({

          article
        } as any)
      }

    } catch {

      alert(
        'Bookmark failed'
      )
    }
  }

  return (

    <button
      className="save-btn"
      onClick={handleClick}
    >

      {exists
        ? 'Saved'
        : 'Save'}

    </button>
  )
}
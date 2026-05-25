import {
  bookmarkRepository
}
from './bookmark.repository.js'

export const bookmarkService = {

  saveArticle: async (
    userId: string,
    articleId: string
  ) => {

    const existing =
      await bookmarkRepository.findExisting(

        userId,
        articleId
      )

    if (existing) {

      throw new Error(
        'Article already bookmarked'
      )
    }

    return bookmarkRepository.create(

      userId,
      articleId
    )
  },

  removeBookmark: async (
    userId: string,
    articleId: string
  ) => {

    return bookmarkRepository.remove(

      userId,
      articleId
    )
  },

  getBookmarks: async (
    userId: string
  ) => {

    return bookmarkRepository
      .getUserBookmarks(userId)
  }
}
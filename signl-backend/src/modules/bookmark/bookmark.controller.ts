import { Response }
from 'express'

import {
  bookmarkService
}
from './bookmark.service.js'

import {
  AuthRequest
}
from '../auth/auth.middleware.js'

export const bookmarkController = {

  save: async (
    req: AuthRequest,
    res: Response
  ) => {

    try {

      const result =
        await bookmarkService.saveArticle(

          req.user.id,

          req.body.articleId as string
        )

      return res.status(201).json({

        success: true,

        data: result
      })

    } catch (error: any) {

      return res.status(400).json({

        success: false,

        message: error.message
      })
    }
  },

  remove: async (
    req: AuthRequest,
    res: Response
  ) => {

    try {

      await bookmarkService.removeBookmark(

        req.user.id,

        req.params.articleId as string
      )

      return res.json({

        success: true,

        message:
          'Bookmark removed'
      })

    } catch (error: any) {

      return res.status(400).json({

        success: false,

        message: error.message
      })
    }
  },

  getMine: async (
    req: AuthRequest,
    res: Response
  ) => {

    try {

      const bookmarks =
        await bookmarkService.getBookmarks(

          req.user.id as string
        )

      return res.json({

        success: true,

        data: bookmarks
      })

    } catch (error: any) {

      return res.status(500).json({

        success: false,

        message: error.message
      })
    }
  }
}
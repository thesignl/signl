import { Request, Response } from 'express'

import { bookmarkService } from './bookmark.service.js'
import { requireUser } from '../auth/auth.middleware.js'
import { AppError } from '../../shared/errors/errorHandler.js'

export const bookmarkController = {
  save: async (req: Request, res: Response) => {
    const user = requireUser(req)
    const articleId = req.body?.articleId as string | undefined
    if (!articleId) throw AppError.badRequest('articleId is required')
    const result = await bookmarkService.saveArticle(user.id, articleId)
    return res.status(201).json({ success: true, data: result })
  },

  remove: async (req: Request, res: Response) => {
    const user = requireUser(req)
    await bookmarkService.removeBookmark(user.id, req.params.articleId as string)
    return res.json({ success: true, message: 'Bookmark removed' })
  },

  getMine: async (req: Request, res: Response) => {
    const user = requireUser(req)
    const bookmarks = await bookmarkService.getBookmarks(user.id)
    return res.json({ success: true, data: bookmarks })
  },
}

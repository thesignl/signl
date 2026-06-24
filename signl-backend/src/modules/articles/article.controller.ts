import { Request, Response } from 'express'

import { articleService } from './article.service.js'
import { createArticleSchema, updateArticleSchema } from './article.validation.js'
import { requireUser } from '../auth/auth.middleware.js'
import { AppError } from '../../shared/errors/errorHandler.js'

/**
 * All handlers throw on error; the global error handler (wired in app.ts)
 * maps thrown errors to the correct status + JSON shape. Wrap each route
 * with asyncHandler so rejected promises are forwarded to it.
 */
export const articleController = {
  create: async (req: Request, res: Response) => {
    const user = requireUser(req)
    const validated = createArticleSchema.parse(req.body)
    const article = await articleService.createArticle(validated, user)
    return res.status(201).json({ success: true, data: article })
  },

  getFeed: async (_req: Request, res: Response) => {
    const articles = await articleService.getHomepageFeed()
    return res.json({ success: true, data: articles })
  },

  search: async (req: Request, res: Response) => {
    const query = (req.query.q as string | undefined)?.trim()
    if (!query || query.length < 2) {
      throw AppError.badRequest('Search query must be at least 2 characters')
    }
    const results = await articleService.searchArticles(query)
    return res.json({ success: true, data: results })
  },

  getBySlug: async (req: Request, res: Response) => {
    const article = await articleService.getArticleBySlug(
      req.params.slug as string,
      req.user ?? null,
    )
    if (!article) throw AppError.notFound('Article not found')
    return res.json({ success: true, data: article })
  },

  getAnalysis: async (_req: Request, res: Response) => {
    const articles = await articleService.getAnalysisFeed()
    return res.json({ success: true, data: articles })
  },

  getAnalysis2: async (_req: Request, res: Response) => {
    const articles = await articleService.getAnalysisArticles()
    return res.json({ success: true, data: articles })
  },

  getBriefs: async (_req: Request, res: Response) => {
    const articles = await articleService.getBriefArticles()
    return res.json({ success: true, data: articles })
  },

  getFeatured: async (_req: Request, res: Response) => {
    const article = await articleService.getFeaturedArticle()
    return res.json({ success: true, data: article })
  },

  getLearn: async (_req: Request, res: Response) => {
    const articles = await articleService.getLearnFeed()
    return res.json({ success: true, data: articles })
  },

  update: async (req: Request, res: Response) => {
    const user = requireUser(req)
    const validated = updateArticleSchema.parse(req.body)
    const article = await articleService.updateArticle(
      req.params.id as string,
      validated,
      user,
    )
    return res.json({ success: true, data: article })
  },

  publish: async (req: Request, res: Response) => {
    const user = requireUser(req)
    const article = await articleService.publishArticle(req.params.id as string, user)
    return res.json({ success: true, data: article })
  },

  unpublish: async (req: Request, res: Response) => {
    const user = requireUser(req)
    const article = await articleService.unpublishArticle(req.params.id as string, user)
    return res.json({ success: true, data: article })
  },

  delete: async (req: Request, res: Response) => {
    requireUser(req)
    await articleService.deleteArticle(req.params.id as string)
    return res.json({ success: true, message: 'Article deleted' })
  },
}

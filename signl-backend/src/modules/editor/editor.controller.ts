import { Request, Response } from 'express'

import { editorService } from './editor.service.js'
import {
  createDraftSchema,
  updateDraftSchema,
} from './editor.validation.js'
import { requireUser } from '../auth/auth.middleware.js'

function actorFrom(req: Request) {
  const user = requireUser(req)
  return {
    id: user.id,
    role: user.role,
    name: (user as { name?: string }).name ?? user.email,
  }
}

// All handlers throw on error; the global error handler (wired in app.ts)
// maps Zod, AppError, Prisma and unknown errors to the correct response.
// Routes wrap these with asyncHandler so rejections reach it.
export const editorController = {
  createDraft: async (req: Request, res: Response) => {
    const input = createDraftSchema.parse(req.body)
    const article = await editorService.createDraft(actorFrom(req), input)
    return res.status(201).json({ success: true, data: article })
  },

  updateDraft: async (req: Request, res: Response) => {
    const input = updateDraftSchema.parse(req.body)
    const article = await editorService.saveDraft(
      req.params.id as string,
      actorFrom(req),
      input,
    )
    return res.json({ success: true, data: article })
  },

  publish: async (req: Request, res: Response) => {
    const article = await editorService.publish(
      req.params.id as string,
      actorFrom(req),
    )
    return res.json({ success: true, data: article })
  },

  submitForReview: async (req: Request, res: Response) => {
    const article = await editorService.submitForReview(
      req.params.id as string,
      actorFrom(req),
    )
    return res.json({ success: true, data: article })
  },

  getDrafts: async (req: Request, res: Response) => {
    const drafts = await editorService.getDrafts(actorFrom(req))
    return res.status(200).json({ success: true, data: drafts })
  },

  getOne: async (req: Request, res: Response) => {
    const article = await editorService.getEditorArticle(
      req.params.id as string,
      actorFrom(req),
    )
    return res.json({ success: true, data: article })
  },

  getCategories: async (_req: Request, res: Response) => {
    const categories = await editorService.getCategories()
    return res.json({ success: true, data: categories })
  },

  getAuthors: async (_req: Request, res: Response) => {
    const authors = await editorService.getAuthors()
    return res.json({ success: true, data: authors })
  },
}

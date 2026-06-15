import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

import { editorService } from './editor.service.js'
import {
  createDraftSchema,
  updateDraftSchema,
} from './editor.validation.js'

function actorFrom(req: Request) {
  return {
    id: req.user.id,
    role: req.user.role,
    name: (req.user as { name?: string }).name ?? req.user.email,
  }
}

function fail(res: Response, error: unknown, fallbackStatus = 500) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      })),
    })
  }
  const message = error instanceof Error ? error.message : 'Unexpected error'
  const status =
    message === 'Unauthorized'
      ? 403
      : message.includes('not found')
        ? 404
        : fallbackStatus
  return res.status(status).json({ success: false, message })
}

export const editorController = {
  createDraft: async (req: Request, res: Response) => {
    try {
      const input = createDraftSchema.parse(req.body)
      const article = await editorService.createDraft(actorFrom(req), input)
      return res.status(201).json({ success: true, data: article })
    } catch (error) {
      return fail(res, error)
    }
  },

  updateDraft: async (req: Request, res: Response) => {
    try {
      const input = updateDraftSchema.parse(req.body)
      const article = await editorService.saveDraft(
        req.params.id as string,
        actorFrom(req),
        input,
      )
      return res.json({ success: true, data: article })
    } catch (error) {
      return fail(res, error)
    }
  },

  publish: async (req: Request, res: Response) => {
    try {
      const article = await editorService.publish(
        req.params.id as string,
        actorFrom(req),
      )
      return res.json({ success: true, data: article })
    } catch (error) {
      return fail(res, error)
    }
  },

  submitForReview: async (req: Request, res: Response) => {
    try {
      const article = await editorService.submitForReview(
        req.params.id as string,
        actorFrom(req),
      )
      return res.json({ success: true, data: article })
    } catch (error) {
      return fail(res, error)
    }
  },

  getDrafts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const drafts = await editorService.getDrafts(actorFrom(req))
      return res.status(200).json({ success: true, data: drafts })
    } catch (error) {
      next(error)
    }
  },

  getOne: async (req: Request, res: Response) => {
    try {
      const article = await editorService.getEditorArticle(
        req.params.id as string,
        actorFrom(req),
      )
      return res.json({ success: true, data: article })
    } catch (error) {
      return fail(res, error)
    }
  },

  getCategories: async (_req: Request, res: Response) => {
    try {
      const categories = await editorService.getCategories()
      return res.json({ success: true, data: categories })
    } catch (error) {
      return fail(res, error)
    }
  },

  getAuthors: async (_req: Request, res: Response) => {
    try {
      const authors = await editorService.getAuthors()
      return res.json({ success: true, data: authors })
    } catch (error) {
      return fail(res, error)
    }
  },
}

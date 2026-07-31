import { Request, Response } from 'express'
import { z } from 'zod'

import { campaignService } from './campaign.service.js'
import { requireUser } from '../auth/auth.middleware.js'

const newsletterInputSchema = z.object({
  title: z.string().max(300).optional(),
  subject: z.string().max(300).optional(),
  preheader: z.string().max(300).nullable().optional(),
  contentHtml: z.string().nullable().optional(),
  contentJson: z.unknown().optional(),
  categoryId: z.string().nullable().optional(),
  templateId: z.string().nullable().optional(),
  status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']).optional(),
})

const scheduleSchema = z.object({ scheduledAt: z.string().datetime() })
const categorySchema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().max(300).optional(),
  displayOrder: z.number().int().min(0).optional(),
})

const ok = (res: Response, data: unknown, message?: string) =>
  res.json({ success: true, data, message })

export const campaignController = {
  // Newsletters (documents)
  createNewsletter: async (req: Request, res: Response) => {
    const user = requireUser(req)
    const data = newsletterInputSchema.parse(req.body)
    ok(res, await campaignService.createNewsletter(user, data))
  },
  updateNewsletter: async (req: Request, res: Response) => {
    const data = newsletterInputSchema.parse(req.body)
    ok(res, await campaignService.updateNewsletter(req.params.id as string, data))
  },
  listNewsletters: async (_req: Request, res: Response) => {
    ok(res, await campaignService.listNewsletters())
  },
  getNewsletter: async (req: Request, res: Response) => {
    ok(res, await campaignService.getNewsletter(req.params.id as string))
  },
  deleteNewsletter: async (req: Request, res: Response) => {
    ok(res, await campaignService.deleteNewsletter(req.params.id as string))
  },
  preview: async (req: Request, res: Response) => {
    ok(res, await campaignService.preview(req.params.id as string))
  },
  estimateAudience: async (req: Request, res: Response) => {
    ok(res, await campaignService.estimateAudience(req.params.id as string))
  },

  // Campaign actions
  sendNow: async (req: Request, res: Response) => {
    const user = requireUser(req)
    ok(res, await campaignService.sendNow(req.params.id as string, user), 'Campaign sending')
  },
  schedule: async (req: Request, res: Response) => {
    const user = requireUser(req)
    const { scheduledAt } = scheduleSchema.parse(req.body)
    ok(
      res,
      await campaignService.schedule(req.params.id as string, new Date(scheduledAt), user),
      'Campaign scheduled',
    )
  },
  listCampaigns: async (_req: Request, res: Response) => {
    ok(res, await campaignService.listCampaigns())
  },
  getCampaign: async (req: Request, res: Response) => {
    ok(res, await campaignService.getCampaign(req.params.id as string))
  },
  cancelSchedule: async (req: Request, res: Response) => {
    ok(res, await campaignService.cancelSchedule(req.params.id as string), 'Schedule cancelled')
  },

  // Categories (configurable newsletter types)
  listCategories: async (_req: Request, res: Response) => {
    ok(res, await campaignService.listCategories())
  },
  createCategory: async (req: Request, res: Response) => {
    const data = categorySchema.parse(req.body)
    ok(res, await campaignService.createCategory(data))
  },
  updateCategory: async (req: Request, res: Response) => {
    const data = categorySchema.partial().parse(req.body)
    ok(res, await campaignService.updateCategory(req.params.id as string, data))
  },
  toggleCategory: async (req: Request, res: Response) => {
    ok(res, await campaignService.toggleCategory(req.params.id as string))
  },
}


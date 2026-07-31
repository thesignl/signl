import prisma from '../../infrastructure/prisma/client.js'
import { campaignRepository } from './campaign.repository.js'
import { dispatchCampaign } from './campaign.dispatcher.js'
import { renderBrandedEmail } from './email/render.js'
import { buildUnsubscribeUrl, buildPreferencesUrl } from './newsletter.config.js'
import { sanitizeArticleHtml, htmlToPlainText } from '../../shared/sanitize.js'
import { AppError } from '../../shared/errors/errorHandler.js'
import { logger } from '../../infrastructure/logger/logger.js'
import type { NewsletterStatus } from '@prisma/client'

type Actor = { id: string; role: string }

interface NewsletterInput {
  title?: string
  subject?: string
  preheader?: string | null
  contentHtml?: string | null
  contentJson?: unknown
  categoryId?: string | null
  templateId?: string | null
  status?: NewsletterStatus
}

export const campaignService = {
  // ── Newsletter documents ────────────────────────────────────────────────────
  createNewsletter: (actor: Actor, data: NewsletterInput) =>
    prisma.newsletter.create({
      data: {
        title: data.title ?? 'Untitled newsletter',
        subject: data.subject ?? '',
        preheader: data.preheader ?? null,
        contentHtml: data.contentHtml ? sanitizeArticleHtml(data.contentHtml) : null,
        contentJson: (data.contentJson as object) ?? undefined,
        categoryId: data.categoryId ?? null,
        templateId: data.templateId ?? null,
        status: 'DRAFT',
        authorId: actor.id,
      },
    }),

  updateNewsletter: async (id: string, data: NewsletterInput) => {
    const existing = await prisma.newsletter.findUnique({ where: { id } })
    if (!existing) throw AppError.notFound('Newsletter not found')

    const patch: Record<string, unknown> = {}
    if (data.title !== undefined) patch.title = data.title
    if (data.subject !== undefined) patch.subject = data.subject
    if (data.preheader !== undefined) patch.preheader = data.preheader
    if (data.contentHtml !== undefined)
      patch.contentHtml = data.contentHtml ? sanitizeArticleHtml(data.contentHtml) : null
    if (data.contentJson !== undefined) patch.contentJson = data.contentJson as object
    if (data.categoryId !== undefined) patch.categoryId = data.categoryId
    if (data.templateId !== undefined) patch.templateId = data.templateId
    if (data.status !== undefined) patch.status = data.status

    return prisma.newsletter.update({ where: { id }, data: patch })
  },

  listNewsletters: () =>
    prisma.newsletter.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        category: { select: { name: true } },
        author: { select: { name: true } },
        _count: { select: { campaigns: true } },
      },
    }),

  getNewsletter: async (id: string) => {
    const n = await prisma.newsletter.findUnique({
      where: { id },
      include: { category: true, template: true },
    })
    if (!n) throw AppError.notFound('Newsletter not found')
    return n
  },

  deleteNewsletter: async (id: string) => {
    const n = await prisma.newsletter.findUnique({ where: { id } })
    if (!n) throw AppError.notFound('Newsletter not found')
    return prisma.newsletter.delete({ where: { id } })
  },

  /** Render the exact branded email HTML for preview (uses a sample unsub token). */
  preview: async (id: string) => {
    const n = await campaignService.getNewsletter(id)
    const sampleToken = 'preview-token'
    const html = renderBrandedEmail({
      subject: n.subject || n.title,
      preheader: n.preheader ?? undefined,
      bodyHtml: sanitizeArticleHtml(n.contentHtml ?? ''),
      unsubscribeUrl: buildUnsubscribeUrl(sampleToken),
      preferencesUrl: buildPreferencesUrl(sampleToken),
    })
    return { html, subject: n.subject || n.title, text: htmlToPlainText(n.contentHtml ?? '') }
  },

  // ── Campaigns ─────────────────────────────────────────────────────────────
  estimateAudience: async (id: string) => {
    const n = await campaignService.getNewsletter(id)
    const recipients = await campaignRepository.selectRecipients(n.categoryId ?? null)
    return { count: recipients.length }
  },

  /** Create a campaign from a newsletter and dispatch immediately (background). */
  sendNow: async (newsletterId: string, actor: Actor) => {
    const n = await campaignService.getNewsletter(newsletterId)
    if (!n.contentHtml || !n.subject) {
      throw AppError.unprocessable('Newsletter needs a subject and body before sending.')
    }
    const campaign = await campaignRepository.create({
      newsletterId,
      subject: n.subject,
      createdById: actor.id,
    })
    await prisma.newsletter.update({ where: { id: newsletterId }, data: { status: 'PUBLISHED' } })

    // Fire-and-forget: never block the HTTP response on the send loop.
    void dispatchCampaign(campaign.id).catch((err) =>
      logger.error('send_now_dispatch_failed', { campaignId: campaign.id, err: String(err) }),
    )
    return { campaignId: campaign.id, status: 'SENDING' }
  },

  /** Create a campaign and schedule it for a future time. */
  schedule: async (newsletterId: string, scheduledAt: Date, actor: Actor) => {
    if (scheduledAt.getTime() <= Date.now()) {
      throw AppError.unprocessable('Scheduled time must be in the future.')
    }
    const n = await campaignService.getNewsletter(newsletterId)
    if (!n.contentHtml || !n.subject) {
      throw AppError.unprocessable('Newsletter needs a subject and body before scheduling.')
    }
    const campaign = await campaignRepository.create({
      newsletterId,
      subject: n.subject,
      createdById: actor.id,
    })
    await campaignRepository.schedule(campaign.id, scheduledAt)
    return { campaignId: campaign.id, status: 'SCHEDULED', scheduledAt }
  },

  listCampaigns: () => campaignRepository.list(),

  getCampaign: async (id: string) => {
    const c = await campaignRepository.findById(id)
    if (!c) throw AppError.notFound('Campaign not found')
    return c
  },

  cancelSchedule: async (id: string) => {
    const c = await campaignRepository.findById(id)
    if (!c) throw AppError.notFound('Campaign not found')
    if (c.status !== 'SCHEDULED') {
      throw AppError.unprocessable('Only scheduled campaigns can be cancelled.')
    }
    return campaignRepository.updateStatus(id, 'DRAFT', { scheduledAt: null })
  },

  // ── Newsletter categories (configurable "types") ────────────────────────────
  listCategories: () =>
    prisma.newsletterCategory.findMany({ orderBy: { displayOrder: 'asc' } }),

  createCategory: (data: { name: string; description?: string; displayOrder?: number }) => {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 60)
    return prisma.newsletterCategory.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        displayOrder: data.displayOrder ?? 0,
      },
    })
  },

  updateCategory: (id: string, data: { name?: string; description?: string; displayOrder?: number }) =>
    prisma.newsletterCategory.update({ where: { id }, data }),

  toggleCategory: async (id: string) => {
    const c = await prisma.newsletterCategory.findUnique({ where: { id } })
    if (!c) throw AppError.notFound('Category not found')
    return prisma.newsletterCategory.update({ where: { id }, data: { active: !c.active } })
  },
}

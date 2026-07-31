import prisma from '../../infrastructure/prisma/client.js'
import type { CampaignStatus, DeliveryStatus, Prisma } from '@prisma/client'

export const campaignRepository = {
  create: (data: {
    newsletterId: string
    subject: string
    createdById?: string
  }) =>
    prisma.campaign.create({
      data: {
        newsletterId: data.newsletterId,
        subject: data.subject,
        createdById: data.createdById,
        status: 'DRAFT',
      },
    }),

  findById: (id: string) =>
    prisma.campaign.findUnique({
      where: { id },
      include: {
        newsletter: { include: { category: true, template: true } },
      },
    }),

  list: (status?: CampaignStatus) =>
    prisma.campaign.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { newsletter: { select: { title: true, category: { select: { name: true } } } } },
    }),

  updateStatus: (id: string, status: CampaignStatus, extra: Prisma.CampaignUpdateInput = {}) =>
    prisma.campaign.update({ where: { id }, data: { status, ...extra } }),

  schedule: (id: string, scheduledAt: Date) =>
    prisma.campaign.update({
      where: { id },
      data: { status: 'SCHEDULED', scheduledAt },
    }),

  delete: (id: string) => prisma.campaign.delete({ where: { id } }),

  /** Campaigns whose scheduled time has arrived and are still SCHEDULED. */
  findDueScheduled: (now: Date) =>
    prisma.campaign.findMany({
      where: { status: 'SCHEDULED', scheduledAt: { lte: now } },
      select: { id: true },
    }),

  /**
   * Active subscribers eligible for a campaign.
   * If a category is given, excludes subscribers who explicitly opted OUT of it
   * (absence of a preference row = opted in by default).
   */
  selectRecipients: async (categoryId: string | null) => {
    if (!categoryId) {
      return prisma.newsletterSubscriber.findMany({
        where: { status: 'ACTIVE' },
        select: { id: true, email: true, unsubscribeToken: true },
      })
    }
    return prisma.newsletterSubscriber.findMany({
      where: {
        status: 'ACTIVE',
        NOT: {
          preferences: { some: { categoryId, subscribed: false } },
        },
      },
      select: { id: true, email: true, unsubscribeToken: true },
    })
  },

  createRecipients: (campaignId: string, subscriberIds: string[]) =>
    prisma.campaignRecipient.createMany({
      data: subscriberIds.map((subscriberId) => ({ campaignId, subscriberId })),
      skipDuplicates: true,
    }),

  updateRecipient: (
    id: string,
    status: DeliveryStatus,
    extra: Prisma.CampaignRecipientUpdateInput = {},
  ) => prisma.campaignRecipient.update({ where: { id }, data: { status, ...extra } }),

  listRecipients: (campaignId: string) =>
    prisma.campaignRecipient.findMany({
      where: { campaignId },
      include: { subscriber: { select: { email: true, unsubscribeToken: true } } },
    }),

  findRecipientByProviderMessageId: (providerMessageId: string) =>
    prisma.campaignRecipient.findFirst({ where: { providerMessageId } }),

  incrementCampaignCounters: (id: string, counters: Prisma.CampaignUpdateInput) =>
    prisma.campaign.update({ where: { id }, data: counters }),

  createDeliveryLog: (data: {
    campaignId?: string | null
    recipientId?: string | null
    event: DeliveryStatus
    providerMessageId?: string | null
    detail?: string | null
    meta?: Prisma.InputJsonValue
  }) =>
    prisma.deliveryLog.create({
      data: {
        campaignId: data.campaignId ?? null,
        recipientId: data.recipientId ?? null,
        event: data.event,
        providerMessageId: data.providerMessageId ?? null,
        detail: data.detail ?? null,
        meta: data.meta,
      },
    }),
}

import { randomBytes } from 'crypto'
import prisma from '../../infrastructure/prisma/client.js'
import type { SubscriberStatus } from '@prisma/client'

/** Opaque, URL-safe token for confirm/unsubscribe links. */
function newToken(): string {
  return randomBytes(24).toString('base64url')
}

export const newsletterRepository = {
  newToken,

  findByEmail: (email: string) =>
    prisma.newsletterSubscriber.findUnique({ where: { email } }),

  findByConfirmToken: (confirmToken: string) =>
    prisma.newsletterSubscriber.findUnique({ where: { confirmToken } }),

  findByUnsubscribeToken: (unsubscribeToken: string) =>
    prisma.newsletterSubscriber.findUnique({ where: { unsubscribeToken } }),

  create: (data: {
    email: string
    name?: string
    source?: string
    status: SubscriberStatus
    confirmToken?: string | null
    confirmedAt?: Date | null
  }) =>
    prisma.newsletterSubscriber.create({
      data: {
        email: data.email,
        name: data.name,
        source: data.source,
        status: data.status,
        confirmToken: data.confirmToken ?? null,
        confirmedAt: data.confirmedAt ?? null,
      },
    }),

  activate: (id: string) =>
    prisma.newsletterSubscriber.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        confirmedAt: new Date(),
        confirmToken: null,
        unsubscribedAt: null,
      },
    }),

  /** Re-open an unsubscribed record for a fresh (double-opt-in) cycle. */
  reopenForConfirm: (id: string, confirmToken: string) =>
    prisma.newsletterSubscriber.update({
      where: { id },
      data: {
        status: 'PENDING',
        confirmToken,
        confirmedAt: null,
        unsubscribedAt: null,
      },
    }),

  markActiveNoConfirm: (id: string) =>
    prisma.newsletterSubscriber.update({
      where: { id },
      data: { status: 'ACTIVE', unsubscribedAt: null, confirmToken: null },
    }),

  unsubscribe: (id: string) =>
    prisma.newsletterSubscriber.update({
      where: { id },
      data: { status: 'UNSUBSCRIBED', unsubscribedAt: new Date() },
    }),

  // ── Preferences ────────────────────────────────────────────────────────────
  listActiveCategories: () =>
    prisma.newsletterCategory.findMany({
      where: { active: true },
      orderBy: { displayOrder: 'asc' },
    }),

  getPreferences: (subscriberId: string) =>
    prisma.emailPreference.findMany({
      where: { subscriberId },
      include: { category: true },
    }),

  upsertPreference: (subscriberId: string, categoryId: string, subscribed: boolean) =>
    prisma.emailPreference.upsert({
      where: { subscriberId_categoryId: { subscriberId, categoryId } },
      update: { subscribed },
      create: { subscriberId, categoryId, subscribed },
    }),
}

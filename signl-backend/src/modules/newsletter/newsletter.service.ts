import { newsletterRepository } from './newsletter.repository.js'
import { newsletterConfig, buildConfirmUrl, buildUnsubscribeUrl } from './newsletter.config.js'
import { getEmailProvider } from './email/index.js'
import { renderTransactionalEmail } from './email/render.js'
import { logger } from '../../infrastructure/logger/logger.js'
import { AppError } from '../../shared/errors/errorHandler.js'

const normalize = (email: string) => email.toLowerCase().trim()

export const newsletterService = {
  /**
   * Subscribe flow (double opt-in by default).
   *
   * - New email → create PENDING + send confirmation email.
   * - Already ACTIVE → idempotent no-op success (no enumeration leak).
   * - Previously UNSUBSCRIBED → reopen a fresh confirm cycle.
   *
   * Never reveals whether an email already exists (returns the same shape).
   */
  subscribe: async (rawEmail: string, opts: { name?: string; source?: string } = {}) => {
    const email = normalize(rawEmail)
    const existing = await newsletterRepository.findByEmail(email)
    const provider = getEmailProvider()

    // Already fully subscribed — idempotent success.
    if (existing && existing.status === 'ACTIVE') {
      return { status: 'active' as const, message: 'You are already subscribed.' }
    }

    if (!newsletterConfig.doubleOptIn) {
      // Single opt-in: activate immediately.
      if (existing) await newsletterRepository.markActiveNoConfirm(existing.id)
      else
        await newsletterRepository.create({
          email,
          name: opts.name,
          source: opts.source,
          status: 'ACTIVE',
          confirmedAt: new Date(),
        })
      return { status: 'active' as const, message: 'You are subscribed.' }
    }

    // Double opt-in: create/reopen PENDING and email a confirmation link.
    const confirmToken = newsletterRepository.newToken()
    if (existing) {
      await newsletterRepository.reopenForConfirm(existing.id, confirmToken)
    } else {
      await newsletterRepository.create({
        email,
        name: opts.name,
        source: opts.source,
        status: 'PENDING',
        confirmToken,
      })
    }

    try {
      await provider.send({
        to: email,
        subject: `Confirm your subscription to The Signl Brief`,
        html: renderTransactionalEmail({
          subject: 'Confirm your subscription',
          heading: 'One more step',
          message:
            'Confirm your email to start receiving The Signl Brief — strategic intelligence and deep analysis, before the market reacts.',
          ctaLabel: 'Confirm subscription',
          ctaUrl: buildConfirmUrl(confirmToken),
        }),
        tags: { type: 'opt_in_confirm' },
      })
    } catch (err) {
      logger.error('newsletter_confirm_send_failed', { email, err: String(err) })
      // Do not fail the request — the subscriber row exists; they can retry.
    }

    return {
      status: 'pending' as const,
      message: 'Almost there — check your inbox to confirm your subscription.',
    }
  },

  /** Confirm a double opt-in subscription via the emailed token. */
  confirm: async (token: string) => {
    const subscriber = await newsletterRepository.findByConfirmToken(token)
    if (!subscriber) {
      throw AppError.badRequest('This confirmation link is invalid or has already been used.')
    }
    if (subscriber.status === 'ACTIVE') {
      return { email: subscriber.email, alreadyActive: true }
    }
    await newsletterRepository.activate(subscriber.id)
    return { email: subscriber.email, alreadyActive: false }
  },

  /** One-click unsubscribe via the tokenized link in every email. */
  unsubscribe: async (token: string) => {
    const subscriber = await newsletterRepository.findByUnsubscribeToken(token)
    if (!subscriber) {
      throw AppError.badRequest('This unsubscribe link is invalid.')
    }
    if (subscriber.status !== 'UNSUBSCRIBED') {
      await newsletterRepository.unsubscribe(subscriber.id)
    }
    return { email: subscriber.email }
  },

  /** Resolve a subscriber + their category preferences for the preferences UI. */
  getPreferencesByToken: async (token: string) => {
    const subscriber = await newsletterRepository.findByUnsubscribeToken(token)
    if (!subscriber) throw AppError.badRequest('Invalid preferences link.')

    const [categories, prefs] = await Promise.all([
      newsletterRepository.listActiveCategories(),
      newsletterRepository.getPreferences(subscriber.id),
    ])
    const prefMap = new Map(prefs.map((p) => [p.categoryId, p.subscribed]))

    return {
      email: subscriber.email,
      status: subscriber.status,
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        // Default opted-in unless explicitly turned off.
        subscribed: prefMap.get(c.id) ?? true,
      })),
    }
  },

  /** Update category preferences via token. */
  updatePreferencesByToken: async (
    token: string,
    updates: { categoryId: string; subscribed: boolean }[],
  ) => {
    const subscriber = await newsletterRepository.findByUnsubscribeToken(token)
    if (!subscriber) throw AppError.badRequest('Invalid preferences link.')

    for (const u of updates) {
      await newsletterRepository.upsertPreference(subscriber.id, u.categoryId, u.subscribed)
    }
    return { email: subscriber.email, updated: updates.length }
  },
}

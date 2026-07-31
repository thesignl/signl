import { createHmac, timingSafeEqual } from 'crypto'
import prisma from '../../infrastructure/prisma/client.js'
import { campaignRepository } from './campaign.repository.js'
import { logger } from '../../infrastructure/logger/logger.js'
import type { DeliveryStatus, Prisma } from '@prisma/client'

/**
 * Resend delivery-event webhook.
 *
 * Resend signs webhooks with Svix (svix-id / svix-timestamp / svix-signature).
 * We verify the HMAC manually to avoid adding the svix SDK dependency.
 *
 * Events → recipient status + campaign counters + immutable DeliveryLog.
 * Opens/clicks are counted once per recipient (first event only) so rates
 * reflect unique engagement, not raw event volume.
 */

interface SvixHeaders {
  id?: string
  timestamp?: string
  signature?: string
}

export function verifyResendSignature(
  rawBody: Buffer,
  headers: SvixHeaders,
  secret: string,
): boolean {
  const { id, timestamp, signature } = headers
  if (!id || !timestamp || !signature) return false

  const secretBytes = Buffer.from(secret.replace(/^whsec_/, ''), 'base64')
  const signedContent = `${id}.${timestamp}.${rawBody.toString('utf8')}`
  const expected = createHmac('sha256', secretBytes).update(signedContent).digest('base64')

  // Header format: "v1,<sig> v1,<sig2>" — any match passes.
  const candidates = signature.split(' ').map((part) => part.split(',')[1] ?? part)
  return candidates.some((sig) => {
    try {
      const a = Buffer.from(sig)
      const b = Buffer.from(expected)
      return a.length === b.length && timingSafeEqual(a, b)
    } catch {
      return false
    }
  })
}

/** Map a Resend event type to our recipient DeliveryStatus + counter field. */
const EVENT_MAP: Record<
  string,
  { status: DeliveryStatus; counter?: keyof Prisma.CampaignUpdateInput; countOncePerRecipient?: boolean }
> = {
  'email.delivered': { status: 'DELIVERED', counter: 'deliveredCount' },
  'email.opened': { status: 'OPENED', counter: 'openCount', countOncePerRecipient: true },
  'email.clicked': { status: 'CLICKED', counter: 'clickCount', countOncePerRecipient: true },
  'email.bounced': { status: 'BOUNCED', counter: 'bounceCount' },
  'email.complained': { status: 'COMPLAINED' },
}

export async function handleResendWebhook(payload: {
  type?: string
  data?: { email_id?: string; to?: string | string[] }
}): Promise<{ ok: true; action: string }> {
  const type = payload.type ?? ''
  const emailId = payload.data?.email_id
  const mapping = EVENT_MAP[type]

  if (!mapping || !emailId) {
    return { ok: true, action: `ignored:${type || 'unknown'}` }
  }

  const recipient = await campaignRepository.findRecipientByProviderMessageId(emailId)
  if (!recipient) {
    return { ok: true, action: 'ignored:recipient-not-found' }
  }

  // Terminal states should not be downgraded (e.g. a late 'delivered' after 'clicked').
  const rank: Record<string, number> = {
    QUEUED: 0, SENT: 1, DELIVERED: 2, OPENED: 3, CLICKED: 4, BOUNCED: 5, FAILED: 5, COMPLAINED: 6,
  }
  const shouldUpgrade = (rank[mapping.status] ?? 0) >= (rank[recipient.status] ?? 0)

  // Count once per recipient for opens/clicks (unique engagement).
  const alreadyEngaged =
    (mapping.status === 'OPENED' && recipient.openedAt != null) ||
    (mapping.status === 'CLICKED' && recipient.clickedAt != null)

  const recipientPatch: Prisma.CampaignRecipientUpdateInput = {}
  if (mapping.status === 'OPENED' && recipient.openedAt == null) recipientPatch.openedAt = new Date()
  if (mapping.status === 'CLICKED' && recipient.clickedAt == null) recipientPatch.clickedAt = new Date()

  if (shouldUpgrade) {
    await campaignRepository.updateRecipient(recipient.id, mapping.status, recipientPatch)
  } else if (Object.keys(recipientPatch).length) {
    await prisma.campaignRecipient.update({ where: { id: recipient.id }, data: recipientPatch })
  }

  // Increment campaign counter (once per recipient for open/click).
  if (mapping.counter && recipient.campaignId && !(mapping.countOncePerRecipient && alreadyEngaged)) {
    await campaignRepository.incrementCampaignCounters(recipient.campaignId, {
      [mapping.counter]: { increment: 1 },
    } as Prisma.CampaignUpdateInput)
  }

  await campaignRepository.createDeliveryLog({
    campaignId: recipient.campaignId,
    recipientId: recipient.id,
    event: mapping.status,
    providerMessageId: emailId,
    detail: type,
  })

  // Bounce/complaint → protect sender reputation: stop mailing this address.
  if (mapping.status === 'BOUNCED' || mapping.status === 'COMPLAINED') {
    await prisma.newsletterSubscriber
      .updateMany({
        where: { recipients: { some: { id: recipient.id } } },
        data: {
          status: mapping.status === 'COMPLAINED' ? 'COMPLAINED' : 'BOUNCED',
          unsubscribedAt: new Date(),
        },
      })
      .catch((err) => logger.error('webhook_subscriber_update_failed', { err: String(err) }))
  }

  return { ok: true, action: `processed:${type}` }
}

import { campaignRepository } from './campaign.repository.js'
import { getEmailProvider } from './email/index.js'
import { renderBrandedEmail } from './email/render.js'
import { buildUnsubscribeUrl, buildPreferencesUrl } from './newsletter.config.js'
import { sanitizeArticleHtml } from '../../shared/sanitize.js'
import { logger } from '../../infrastructure/logger/logger.js'

/** Simple concurrency-limited map — sends N emails in parallel per batch. */
async function inBatches<T>(
  items: T[],
  size: number,
  fn: (item: T) => Promise<void>,
): Promise<void> {
  for (let i = 0; i < items.length; i += size) {
    const batch = items.slice(i, i + size)
    await Promise.all(batch.map(fn))
  }
}

const SEND_CONCURRENCY = Number(process.env.NEWSLETTER_SEND_CONCURRENCY ?? 10)
const MAX_ATTEMPTS = 2

/**
 * Core dispatch engine. Idempotent-ish: only processes recipients that are
 * still QUEUED/FAILED, so a re-run after a crash resumes rather than
 * double-sending DELIVERED ones.
 *
 * Runs in-process (fire-and-forget from the API). When REDIS_URL is set this
 * same function is what a BullMQ worker would call — no logic duplication.
 */
export async function dispatchCampaign(campaignId: string): Promise<void> {
  const campaign = await campaignRepository.findById(campaignId)
  if (!campaign) {
    logger.error('dispatch_campaign_not_found', { campaignId })
    return
  }
  if (campaign.status === 'SENT' || campaign.status === 'SENDING') {
    logger.warn('dispatch_skipped_wrong_status', { campaignId, status: campaign.status })
    return
  }

  const provider = getEmailProvider()
  const { newsletter } = campaign
  const categoryId = newsletter.categoryId ?? null

  // Materialize the audience snapshot as recipient rows (idempotent via skipDuplicates).
  const audience = await campaignRepository.selectRecipients(categoryId)
  if (audience.length > 0) {
    await campaignRepository.createRecipients(
      campaignId,
      audience.map((a) => a.id),
    )
  }

  await campaignRepository.updateStatus(campaignId, 'SENDING', {
    startedAt: new Date(),
    totalRecipients: audience.length,
  })

  const recipients = await campaignRepository.listRecipients(campaignId)
  const pending = recipients.filter((r) => r.status === 'QUEUED' || r.status === 'FAILED')

  const bodyHtml = sanitizeArticleHtml(newsletter.contentHtml ?? '')
  let sent = 0
  let failed = 0

  await inBatches(pending, SEND_CONCURRENCY, async (recipient) => {
    const unsubscribeUrl = buildUnsubscribeUrl(recipient.subscriber.unsubscribeToken)
    const html = renderBrandedEmail({
      subject: campaign.subject,
      preheader: newsletter.preheader ?? undefined,
      bodyHtml,
      unsubscribeUrl,
      preferencesUrl: buildPreferencesUrl(recipient.subscriber.unsubscribeToken),
    })

    let lastError = ''
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const result = await provider.send({
          to: recipient.subscriber.email,
          subject: campaign.subject,
          html,
          unsubscribeUrl,
          tags: { campaignId, recipientId: recipient.id },
        })
        await campaignRepository.updateRecipient(recipient.id, 'SENT', {
          sentAt: new Date(),
          providerMessageId: result.messageId,
          error: null,
        })
        await campaignRepository.createDeliveryLog({
          campaignId,
          recipientId: recipient.id,
          event: 'SENT',
          providerMessageId: result.messageId,
        })
        sent++
        return
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err)
      }
    }

    // All attempts failed.
    await campaignRepository.updateRecipient(recipient.id, 'FAILED', { error: lastError })
    await campaignRepository.createDeliveryLog({
      campaignId,
      recipientId: recipient.id,
      event: 'FAILED',
      detail: lastError,
    })
    failed++
  })

  await campaignRepository.incrementCampaignCounters(campaignId, {
    sentCount: sent,
    failedCount: failed,
  })
  await campaignRepository.updateStatus(
    campaignId,
    failed > 0 && sent === 0 ? 'FAILED' : 'SENT',
    { completedAt: new Date() },
  )

  logger.info('dispatch_campaign_complete', { campaignId, sent, failed })
}

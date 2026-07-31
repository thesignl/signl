import { campaignRepository } from './campaign.repository.js'
import { dispatchCampaign } from './campaign.dispatcher.js'
import { logger } from '../../infrastructure/logger/logger.js'

/**
 * Scheduled-campaign processor.
 *
 * Launch-ready without Redis: a lightweight in-process poller checks for due
 * SCHEDULED campaigns every interval and dispatches them. When REDIS_URL is
 * configured this can be swapped for a BullMQ delayed-job worker calling the
 * same `dispatchCampaign` — no send-logic duplication.
 *
 * Safe for single-instance deploys (the current SIGNL topology). For
 * multi-instance, move to BullMQ so only one worker claims each job.
 */
const POLL_INTERVAL_MS = Number(process.env.NEWSLETTER_SCHEDULER_INTERVAL_MS ?? 60_000)

let timer: NodeJS.Timeout | null = null
let running = false

async function tick(): Promise<void> {
  if (running) return // prevent overlapping runs
  running = true
  try {
    const due = await campaignRepository.findDueScheduled(new Date())
    for (const { id } of due) {
      // Claim by flipping to SENDING before dispatch to avoid double-processing.
      await campaignRepository.updateStatus(id, 'SENDING', { startedAt: new Date() })
      void dispatchCampaign(id).catch((err) =>
        logger.error('scheduled_dispatch_failed', { campaignId: id, err: String(err) }),
      )
    }
    if (due.length > 0) logger.info('scheduler_dispatched', { count: due.length })
  } catch (err) {
    logger.error('scheduler_tick_failed', { err: String(err) })
  } finally {
    running = false
  }
}

export function startNewsletterScheduler(): void {
  if (timer) return
  timer = setInterval(tick, POLL_INTERVAL_MS)
  // Don't keep the process alive solely for the poller.
  if (typeof timer.unref === 'function') timer.unref()
  logger.info('newsletter_scheduler_started', { intervalMs: POLL_INTERVAL_MS })
}

export function stopNewsletterScheduler(): void {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

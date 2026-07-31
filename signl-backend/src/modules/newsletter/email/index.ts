import { logger } from '../../../infrastructure/logger/logger.js'
import type { EmailProvider } from './email.types.js'
import { consoleProvider } from './console.provider.js'
import { createResendProvider } from './resend.provider.js'

export type { EmailMessage, EmailProvider, EmailSendResult } from './email.types.js'
export { htmlToText } from './email.types.js'

let cached: EmailProvider | null = null

/**
 * Resolves the active email provider from EMAIL_PROVIDER.
 *
 *   EMAIL_PROVIDER=resend   → Resend adapter (requires RESEND_API_KEY + EMAIL_FROM)
 *   EMAIL_PROVIDER=console  → logs only (default; safe everywhere)
 *
 * New providers (SES, SendGrid, Postmark) plug in here with a single case —
 * no changes anywhere else in the codebase.
 */
export function getEmailProvider(): EmailProvider {
  if (cached) return cached

  const choice = (process.env.EMAIL_PROVIDER ?? 'console').toLowerCase()

  switch (choice) {
    case 'resend':
      cached = createResendProvider()
      break
    case 'console':
    case '':
      cached = consoleProvider
      break
    default:
      logger.warn('email_provider_unknown', {
        choice,
        fallback: 'console',
      })
      cached = consoleProvider
  }

  logger.info('email_provider_selected', { provider: cached.name })
  return cached
}

/** Test seam — reset the memoized provider (used by unit tests). */
export function resetEmailProvider(): void {
  cached = null
}

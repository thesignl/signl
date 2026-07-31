import { randomUUID } from 'crypto'
import { logger } from '../../../infrastructure/logger/logger.js'
import type { EmailMessage, EmailProvider, EmailSendResult } from './email.types.js'

/**
 * Default provider used when no email vendor is configured.
 *
 * It does NOT send real mail — it logs the message and returns a synthetic
 * message id. This keeps every environment (local, CI, preview) fully
 * functional and testable without credentials, and makes the "no key set"
 * path safe rather than crashing a campaign send.
 */
export const consoleProvider: EmailProvider = {
  name: 'console',

  async send(message: EmailMessage): Promise<EmailSendResult> {
    const messageId = `console_${randomUUID()}`
    logger.info('email_console_send', {
      provider: 'console',
      to: message.to,
      subject: message.subject,
      messageId,
      note: 'No email provider configured — message logged, not delivered.',
    })
    return { messageId, provider: 'console' }
  },
}

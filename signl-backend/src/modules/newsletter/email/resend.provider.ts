import { logger } from '../../../infrastructure/logger/logger.js'
import { AppError } from '../../../shared/errors/errorHandler.js'
import { htmlToText, type EmailMessage, type EmailProvider, type EmailSendResult } from './email.types.js'

/**
 * Resend adapter — talks to the Resend REST API via native fetch (Node 22+),
 * so no vendor SDK dependency is added to the project.
 *
 * Configuration (env):
 *   EMAIL_PROVIDER=resend
 *   RESEND_API_KEY=re_xxx
 *   EMAIL_FROM="Signl <brief@signl.media>"
 *
 * Docs: https://resend.com/docs/api-reference/emails/send-email
 */
const RESEND_ENDPOINT = 'https://api.resend.com/emails'

interface ResendResponse {
  id?: string
  message?: string
  name?: string
}

export function createResendProvider(): EmailProvider {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM

  return {
    name: 'resend',

    async send(message: EmailMessage): Promise<EmailSendResult> {
      if (!apiKey || !from) {
        // Fail fast with a clear operational error rather than a vague 500.
        throw new AppError(
          503,
          'Email provider not configured (RESEND_API_KEY / EMAIL_FROM missing).',
          'EMAIL_NOT_CONFIGURED',
        )
      }

      const headers: Record<string, string> = {}
      if (message.unsubscribeUrl) {
        // RFC 8058 one-click unsubscribe — improves deliverability + compliance.
        headers['List-Unsubscribe'] = `<${message.unsubscribeUrl}>`
        headers['List-Unsubscribe-Post'] = 'List-Unsubscribe=One-Click'
      }

      const res = await fetch(RESEND_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: message.to,
          subject: message.subject,
          html: message.html,
          text: message.text ?? htmlToText(message.html),
          headers: Object.keys(headers).length ? headers : undefined,
          tags: message.tags
            ? Object.entries(message.tags).map(([name, value]) => ({ name, value }))
            : undefined,
        }),
      })

      const data = (await res.json().catch(() => ({}))) as ResendResponse

      if (!res.ok || !data.id) {
        logger.error('email_resend_failed', {
          status: res.status,
          error: data.message ?? data.name ?? 'unknown',
          to: message.to,
        })
        // Throw so the queue treats it as retryable.
        throw new AppError(
          502,
          `Resend send failed: ${data.message ?? res.statusText}`,
          'EMAIL_SEND_FAILED',
        )
      }

      return { messageId: data.id, provider: 'resend' }
    },
  }
}

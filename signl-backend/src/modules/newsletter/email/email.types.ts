/**
 * Provider-agnostic email contract.
 *
 * Every concrete provider (Resend, SES, SendGrid, …) implements this single
 * interface, so the rest of the platform never imports a vendor SDK directly.
 * Swapping providers is an env change (EMAIL_PROVIDER), not a code change.
 */

export interface EmailMessage {
  to: string
  subject: string
  html: string
  /** Plain-text fallback. Auto-derived from HTML when omitted. */
  text?: string
  /** Optional per-message unsubscribe URL → becomes List-Unsubscribe header. */
  unsubscribeUrl?: string
  /** Arbitrary tags for provider-side analytics correlation. */
  tags?: Record<string, string>
}

export interface EmailSendResult {
  /** Provider-side message id — stored on CampaignRecipient for webhook correlation. */
  messageId: string
  provider: string
}

export interface EmailProvider {
  readonly name: string
  /** Send a single message. Throws on hard failure so the queue can retry. */
  send(message: EmailMessage): Promise<EmailSendResult>
}

/** Naive but safe HTML → text fallback for clients that block HTML. */
export function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

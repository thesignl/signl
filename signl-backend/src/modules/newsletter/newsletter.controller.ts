import { Request, Response } from 'express'

import {
  subscribeSchema,
  tokenSchema,
  updatePreferencesSchema,
} from './newsletter.validation.js'
import { newsletterService } from './newsletter.service.js'
import { newsletterConfig } from './newsletter.config.js'
import { verifyResendSignature, handleResendWebhook } from './campaign.webhook.js'
import { logger } from '../../infrastructure/logger/logger.js'

/** Minimal branded HTML page for the confirm/unsubscribe redirect landings. */
function resultPage(title: string, message: string): string {
  const { brand, siteUrl } = newsletterConfig
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>${title} · ${brand.name}</title>
  <style>body{margin:0;font-family:Georgia,serif;background:${brand.paper};color:${brand.ink};display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px;}
  .card{max-width:440px;background:#fff;border:1px solid #eae6dd;border-radius:10px;padding:40px;text-align:center;}
  h1{font-size:22px;margin:0 0 12px;} p{color:${brand.muted};line-height:1.6;margin:0 0 24px;font-size:15px;}
  a{display:inline-block;background:${brand.accent};color:#fff;text-decoration:none;padding:11px 22px;border-radius:6px;font-family:Arial,sans-serif;font-size:14px;font-weight:600;}
  .logo{font-size:20px;font-weight:700;margin-bottom:20px;}</style></head>
  <body><div class="card"><div class="logo">${brand.name}<span style="color:${brand.accent}">.</span></div>
  <h1>${title}</h1><p>${message}</p><a href="${siteUrl}">Back to ${brand.name}</a></div></body></html>`
}

export const newsletterController = {
  subscribe: async (req: Request, res: Response) => {
    const data = subscribeSchema.parse(req.body)
    const result = await newsletterService.subscribe(data.email, {
      name: data.name,
      source: data.source ?? 'api',
    })
    return res.json({ success: true, data: result, message: result.message })
  },

  // GET /newsletter/confirm?token=… — clicked from the confirmation email.
  confirm: async (req: Request, res: Response) => {
    const { token } = tokenSchema.parse({ token: req.query.token })
    await newsletterService.confirm(token)
    return res
      .status(200)
      .type('html')
      .send(
        resultPage(
          'Subscription confirmed',
          'You are now subscribed to The Signl Brief. Watch your inbox.',
        ),
      )
  },

  // GET /newsletter/unsubscribe?token=… — one-click from any email footer.
  unsubscribe: async (req: Request, res: Response) => {
    const { token } = tokenSchema.parse({ token: req.query.token })
    await newsletterService.unsubscribe(token)
    return res
      .status(200)
      .type('html')
      .send(
        resultPage(
          'Unsubscribed',
          'You have been unsubscribed. We are sorry to see you go.',
        ),
      )
  },

  // POST /newsletter/unsubscribe — RFC 8058 one-click (List-Unsubscribe-Post).
  unsubscribePost: async (req: Request, res: Response) => {
    const token = String(req.query.token ?? req.body?.token ?? '')
    const parsed = tokenSchema.parse({ token })
    await newsletterService.unsubscribe(parsed.token)
    return res.status(200).json({ success: true, message: 'Unsubscribed' })
  },

  getPreferences: async (req: Request, res: Response) => {
    const { token } = tokenSchema.parse({ token: req.query.token })
    const data = await newsletterService.getPreferencesByToken(token)
    return res.json({ success: true, data })
  },

  updatePreferences: async (req: Request, res: Response) => {
    const data = updatePreferencesSchema.parse(req.body)
    const result = await newsletterService.updatePreferencesByToken(
      data.token,
      data.preferences,
    )
    return res.json({ success: true, data: result, message: 'Preferences updated' })
  },

  // POST /newsletter/webhook/resend — Svix-signed delivery events from Resend.
  // Mounted with express.raw so the raw body is available for signature checks.
  resendWebhook: async (req: Request, res: Response) => {
    const secret = process.env.RESEND_WEBHOOK_SECRET
    const raw = req.body as Buffer

    if (secret) {
      const valid = verifyResendSignature(
        raw,
        {
          id: req.header('svix-id') ?? undefined,
          timestamp: req.header('svix-timestamp') ?? undefined,
          signature: req.header('svix-signature') ?? undefined,
        },
        secret,
      )
      if (!valid) {
        logger.warn('resend_webhook_bad_signature')
        return res.status(401).json({ success: false, message: 'Invalid signature' })
      }
    } else {
      logger.warn('resend_webhook_unverified', {
        note: 'RESEND_WEBHOOK_SECRET not set — processing without verification (dev only).',
      })
    }

    let payload: { type?: string; data?: { email_id?: string; to?: string | string[] } }
    try {
      payload = JSON.parse(raw.toString('utf8'))
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid payload' })
    }

    const result = await handleResendWebhook(payload)
    return res.json({ success: true, data: result })
  },
}

import { Router } from 'express'

import { newsletterController } from './newsletter.controller.js'
import { asyncHandler } from '../../shared/utils/asyncHandler.js'

const router = Router()

// ── Public subscriber lifecycle ──────────────────────────────────────────────
router.post('/subscribe', asyncHandler(newsletterController.subscribe))

// Token links delivered inside emails (GET so they work from any mail client).
router.get('/confirm', asyncHandler(newsletterController.confirm))
router.get('/unsubscribe', asyncHandler(newsletterController.unsubscribe))

// RFC 8058 one-click unsubscribe (mail clients POST here via List-Unsubscribe-Post).
router.post('/unsubscribe', asyncHandler(newsletterController.unsubscribePost))

// Preference center (token-scoped, no login required).
router.get('/preferences', asyncHandler(newsletterController.getPreferences))
router.post('/preferences', asyncHandler(newsletterController.updatePreferences))

// Resend delivery-event webhook (raw body + Svix signature; mounted in app.ts).
router.post('/webhook/resend', asyncHandler(newsletterController.resendWebhook))

export default router

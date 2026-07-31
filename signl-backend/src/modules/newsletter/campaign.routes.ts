import { Router } from 'express'

import { campaignController } from './campaign.controller.js'
import { authenticate, authorize } from '../auth/auth.middleware.js'
import { asyncHandler } from '../../shared/utils/asyncHandler.js'

const router = Router()

// All campaign routes require authentication.
router.use(authenticate)

// ── Newsletter categories (configurable types) ───────────────────────────────
router.get('/categories', authorize('ADMIN', 'EDITOR'), asyncHandler(campaignController.listCategories))
router.post('/categories', authorize('ADMIN'), asyncHandler(campaignController.createCategory))
router.patch('/categories/:id/toggle', authorize('ADMIN'), asyncHandler(campaignController.toggleCategory))
router.patch('/categories/:id', authorize('ADMIN'), asyncHandler(campaignController.updateCategory))

// ── Newsletters (documents) — ADMIN + EDITOR ─────────────────────────────────
router.get('/newsletters', authorize('ADMIN', 'EDITOR'), asyncHandler(campaignController.listNewsletters))
router.post('/newsletters', authorize('ADMIN', 'EDITOR'), asyncHandler(campaignController.createNewsletter))
router.get('/newsletters/:id', authorize('ADMIN', 'EDITOR'), asyncHandler(campaignController.getNewsletter))
router.patch('/newsletters/:id', authorize('ADMIN', 'EDITOR'), asyncHandler(campaignController.updateNewsletter))
router.get('/newsletters/:id/preview', authorize('ADMIN', 'EDITOR'), asyncHandler(campaignController.preview))
router.get('/newsletters/:id/audience', authorize('ADMIN', 'EDITOR'), asyncHandler(campaignController.estimateAudience))
router.delete('/newsletters/:id', authorize('ADMIN'), asyncHandler(campaignController.deleteNewsletter))

// ── Send / schedule ──────────────────────────────────────────────────────────
router.post('/newsletters/:id/send', authorize('ADMIN', 'EDITOR'), asyncHandler(campaignController.sendNow))
router.post('/newsletters/:id/schedule', authorize('ADMIN', 'EDITOR'), asyncHandler(campaignController.schedule))

// ── Campaigns (send instances) ───────────────────────────────────────────────
router.get('/', authorize('ADMIN', 'EDITOR'), asyncHandler(campaignController.listCampaigns))
router.get('/:id', authorize('ADMIN', 'EDITOR'), asyncHandler(campaignController.getCampaign))
router.post('/:id/cancel', authorize('ADMIN', 'EDITOR'), asyncHandler(campaignController.cancelSchedule))

export default router

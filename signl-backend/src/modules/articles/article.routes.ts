import { Router } from 'express'

import { articleController } from './article.controller.js'
import { authenticate, authorize, optionalAuthenticate } from '../auth/auth.middleware.js'
import { asyncHandler } from '../../shared/utils/asyncHandler.js'

const router = Router()

// ── Public reads ───────────────────────────────────────────────────────────
router.get('/', asyncHandler(articleController.getFeed))
router.get('/search', asyncHandler(articleController.search))
router.get('/analysis/feed', asyncHandler(articleController.getAnalysis))
router.get('/briefs', asyncHandler(articleController.getBriefs))
router.get('/analysis', asyncHandler(articleController.getAnalysis2))
router.get('/featured', asyncHandler(articleController.getFeatured))
router.get('/learn/feed', asyncHandler(articleController.getLearn))

// Slug route is last among GETs so it doesn't shadow the named routes above.
// optionalAuthenticate lets premium gating personalize for signed-in readers.
router.get('/:slug', optionalAuthenticate, asyncHandler(articleController.getBySlug))

// ── Authoring (EDITOR / ADMIN) ───────────────────────────────────────────────
router.post('/', authenticate, authorize('ADMIN', 'EDITOR'), asyncHandler(articleController.create))
router.patch('/:id', authenticate, authorize('ADMIN', 'EDITOR'), asyncHandler(articleController.update))
router.patch('/:id/publish', authenticate, authorize('ADMIN', 'EDITOR'), asyncHandler(articleController.publish))
router.patch('/:id/unpublish', authenticate, authorize('ADMIN', 'EDITOR'), asyncHandler(articleController.unpublish))

// ── Destructive (ADMIN only) ─────────────────────────────────────────────────
router.delete('/:id', authenticate, authorize('ADMIN'), asyncHandler(articleController.delete))

export default router

import { Router } from 'express'

import { authController } from './auth.controller.js'
import { authenticate } from './auth.middleware.js'
import { asyncHandler } from '../../shared/utils/asyncHandler.js'

const router = Router()

// Note: /api/auth is already rate-limited at the app level (authLimiter:
// 20 req / 15 min per IP). These per-route limits add defense-in-depth.

router.post('/signup', asyncHandler(authController.signup))
router.post('/login', asyncHandler(authController.login))
router.post('/refresh', asyncHandler(authController.refresh))
router.post('/logout', asyncHandler(authController.logout))
router.get('/me', authenticate, asyncHandler(authController.me))

export default router

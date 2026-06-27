import { Router } from 'express'
import { authenticate } from '../auth/auth.middleware.js'
import { asyncHandler } from '../../shared/utils/asyncHandler.js'
import { subscriptionController } from './subscription.controller.js'

const router = Router()

// Public — no auth required to browse plans
router.get('/plans', asyncHandler(subscriptionController.getPlans))

// Razorpay webhook — authenticated by HMAC signature (NOT a user JWT), so
// mounted BEFORE the `authenticate` middleware. The route's raw-body parser
// is wired in app.ts so signature verification sees the exact bytes received.
router.post('/webhook', asyncHandler(subscriptionController.webhook))

// Authenticated routes
router.use(authenticate)

router.get('/status', asyncHandler(subscriptionController.getStatus))
router.post('/checkout', asyncHandler(subscriptionController.checkout))
router.post('/verify', asyncHandler(subscriptionController.verify))
router.post('/cancel', asyncHandler(subscriptionController.cancel))

export default router

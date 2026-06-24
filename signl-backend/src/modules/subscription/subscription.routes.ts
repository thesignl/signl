import { Router } from 'express'
import { authenticate } from '../auth/auth.middleware.js'
import { subscriptionController } from './subscription.controller.js'

const router = Router()

// Public — no auth required to browse plans
router.get('/plans', subscriptionController.getPlans)

// Authenticated routes
router.use(authenticate)

router.get('/status', subscriptionController.getStatus)
router.post('/checkout', subscriptionController.checkout)
router.post('/verify', subscriptionController.verify)
router.post('/cancel', subscriptionController.cancel)

export default router

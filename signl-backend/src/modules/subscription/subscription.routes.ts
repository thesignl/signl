import { Router } from 'express'
import { authenticate } from '../auth/auth.middleware.js'
import { subscriptionController } from './subscription.controller.js'

const router = Router()

router.use(authenticate)

router.get('/status', subscriptionController.getStatus)

export default router

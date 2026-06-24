import { Router } from 'express'
import { authenticate } from '../auth/auth.middleware.js'
import { asyncHandler } from '../../shared/utils/asyncHandler.js'
import { subscriptionController } from './subscription.controller.js'

const router = Router()

router.use(authenticate)

router.get('/status', asyncHandler(subscriptionController.getStatus))

export default router

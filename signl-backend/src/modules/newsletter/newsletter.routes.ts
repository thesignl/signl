import { Router } from 'express'

import { newsletterController } from './newsletter.controller.js'
import { asyncHandler } from '../../shared/utils/asyncHandler.js'

const router = Router()

router.post('/subscribe', asyncHandler(newsletterController.subscribe))

export default router

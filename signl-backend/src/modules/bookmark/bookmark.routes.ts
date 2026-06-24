import { Router } from 'express'

import { bookmarkController } from './bookmark.controller.js'
import { authenticate } from '../auth/auth.middleware.js'
import { asyncHandler } from '../../shared/utils/asyncHandler.js'

const router = Router()

router.post('/', authenticate, asyncHandler(bookmarkController.save))
router.delete('/:articleId', authenticate, asyncHandler(bookmarkController.remove))
router.get('/', authenticate, asyncHandler(bookmarkController.getMine))

export default router

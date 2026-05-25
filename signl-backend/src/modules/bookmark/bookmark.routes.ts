import { Router }
from 'express'

import {
  bookmarkController
}
from './bookmark.controller.js'

import {
  authenticate
}
from '../auth/auth.middleware.js'

const router = Router()

router.post(
  '/',
  authenticate,
  bookmarkController.save
)

router.delete(
  '/:articleId',
  authenticate,
  bookmarkController.remove
)

router.get(
  '/',
  authenticate,
  bookmarkController.getMine
)

export default router
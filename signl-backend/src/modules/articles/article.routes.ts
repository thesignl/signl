import { Router } from 'express'

import {
  articleController
}
from './article.controller.js'

const router = Router()

router.post(
  '/',
  articleController.create
)

router.get(
  '/',
  articleController.getFeed
)

router.get(
  '/:slug',
  articleController.getBySlug
)

export default router
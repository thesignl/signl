import { Router } from 'express'

import {
  articleController
}
from './article.controller.js'
import { authenticate, authorize } from '../auth/auth.middleware.js'

const router = Router()

router.get(
  '/',
  articleController.getFeed
)

router.get(
  '/search',
  articleController.search
)

router.get(
  '/analysis/feed',
  articleController.getAnalysis
)

router.get(
  '/briefs',
  articleController.getBriefs
)

router.get(
  '/analysis',
  articleController.getAnalysis2
)

router.get(
  '/featured',
  articleController.getFeatured
)

router.get(
  '/learn/feed',
  articleController.getLearn
)

router.get(
  '/:slug',
  articleController.getBySlug
)

router.post(

  '/',

  authenticate,

  authorize(
    'ADMIN',
    'EDITOR'
  ),

  articleController.create
)

router.patch(

  '/:id',

  authenticate,

  authorize(
    'ADMIN',
    'EDITOR'
  ),

  articleController.update
)

router.patch(

  '/:id/publish',

  authenticate,

  authorize(
    'ADMIN',
    'EDITOR'
  ),

  articleController.publish
)

router.patch(

  '/:id/unpublish',

  authenticate,

  authorize(
    'ADMIN',
    'EDITOR'
  ),

  articleController.unpublish
)

router.delete(

  '/:id',

  authenticate,

  authorize('ADMIN'),

  articleController.delete
)

export default router
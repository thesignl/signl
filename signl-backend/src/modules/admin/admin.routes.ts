import { Router }
from 'express'

import {
  adminController
}
from './admin.controller.js'

import {

  authenticate,

  authorize

}
from '../auth/auth.middleware.js'

const router = Router()

router.use(
  authenticate
)

router.use(
  authorize(
    'ADMIN'
  )
)

router.get(
  '/dashboard',
  adminController.dashboard
)

// ── Users ─────────────────────────────────────────────────────

router.get(
  '/users',
  adminController.users
)

router.patch(
  '/users/:id/role',
  adminController.updateRole
)

router.delete(
  '/users/:id',
  adminController.deleteUser
)

// ── Articles ──────────────────────────────────────────────────
// POST /bulk registered before GET /:id to avoid param capture on same method

router.get(
  '/articles',
  adminController.listArticles
)

router.post(
  '/articles/bulk',
  adminController.bulkArticleAction
)

router.get(
  '/articles/:id',
  adminController.getArticleById
)

router.patch(
  '/articles/:id/status',
  adminController.changeArticleStatus
)

// ── Authors / Editors ─────────────────────────────────────────

router.get(
  '/authors',
  adminController.listAuthors
)

router.get(
  '/authors/:id',
  adminController.getAuthor
)

router.patch(
  '/authors/:id',
  adminController.updateAuthor
)

// ── Categories ────────────────────────────────────────────────
// /toggle before /:id so Express does not treat 'toggle' as an id

router.get(
  '/categories',
  adminController.listCategories
)

router.post(
  '/categories',
  adminController.createCategory
)

router.patch(
  '/categories/:id/toggle',
  adminController.toggleCategoryActive
)

router.patch(
  '/categories/:id',
  adminController.updateCategory
)

router.delete(
  '/categories/:id',
  adminController.deleteCategory
)

// ── Tags ──────────────────────────────────────────────────────

router.get(
  '/tags',
  adminController.listTags
)

router.post(
  '/tags',
  adminController.createTag
)

router.patch(
  '/tags/:id',
  adminController.updateTag
)

router.delete(
  '/tags/:id',
  adminController.deleteTag
)

// ── Placements ────────────────────────────────────────────────

router.get(
  '/placements',
  adminController.listPlacements
)

router.post(
  '/placements',
  adminController.createPlacement
)

router.patch(
  '/placements/:id',
  adminController.updatePlacement
)

router.delete(
  '/placements/:id',
  adminController.deletePlacement
)

export default router
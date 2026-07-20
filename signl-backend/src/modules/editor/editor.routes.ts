import { Router } from 'express'

import { editorController } from './editor.controller.js'
import { authenticate, authorize } from '../auth/auth.middleware.js'
import { asyncHandler } from '../../shared/utils/asyncHandler.js'

const router = Router()

router.use(authenticate)
router.use(authorize('ADMIN', 'EDITOR'))

// Reference data for the editor metadata panel
router.get('/categories', asyncHandler(editorController.getCategories))
router.get('/authors', asyncHandler(editorController.getAuthors))

// Article list (all statuses owned by the editor)
router.get('/drafts', asyncHandler(editorController.getDrafts))

// Draft lifecycle
router.post('/draft', asyncHandler(editorController.createDraft))
router.patch('/draft/:id', asyncHandler(editorController.updateDraft))
router.patch('/publish/:id', asyncHandler(editorController.publish))
router.patch('/review/:id', asyncHandler(editorController.submitForReview))

// Single article (keep last — it's the catch-all GET)
router.get('/:id', asyncHandler(editorController.getOne))

export default router

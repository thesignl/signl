import { Router } from 'express'

import { editorController } from './editor.controller.js'
import { authenticate, authorize } from '../auth/auth.middleware.js'

const router = Router()

router.use(authenticate)
router.use(authorize('ADMIN', 'EDITOR'))

// Reference data for the editor metadata panel
router.get('/categories', editorController.getCategories)
router.get('/authors', editorController.getAuthors)

// Article list (all statuses owned by the editor)
router.get('/drafts', editorController.getDrafts)

// Draft lifecycle
router.post('/draft', editorController.createDraft)
router.patch('/draft/:id', editorController.updateDraft)
router.patch('/publish/:id', editorController.publish)
router.patch('/review/:id', editorController.submitForReview)

// Single article (keep last — it's the catch-all GET)
router.get('/:id', editorController.getOne)

export default router

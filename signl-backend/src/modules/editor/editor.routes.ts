import { Router }
from 'express'

import {
  editorController
}
from './editor.controller.js'

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
    'ADMIN',
    'EDITOR'
  )
)

router.post(
  '/draft',
  editorController.createDraft
)

router.patch(
  '/draft/:id',
  editorController.updateDraft
)

router.patch(
  '/publish/:id',
  editorController.publish
)

export default router
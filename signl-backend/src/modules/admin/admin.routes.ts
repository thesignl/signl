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

export default router
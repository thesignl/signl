import { Router }
from 'express'

import {
  authController
}
from './auth.controller.js'

import rateLimit from 'express-rate-limit'

const router = Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
})

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
})

router.post(
  '/signup',
  signupLimiter,
  authController.signup
)

router.post(
  '/login',
  loginLimiter,
  authController.login
)

export default router

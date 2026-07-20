import { Request, Response } from 'express'

import { authService } from './auth.service.js'
import { signupSchema, loginSchema, refreshSchema } from './auth.validation.js'
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from './jwt.js'
import { authRepository } from './auth.repository.js'
import { requireUser } from './auth.middleware.js'
import { AppError } from '../../shared/errors/errorHandler.js'

const REFRESH_COOKIE = 'signl_refresh'
const isProd = process.env.NODE_ENV === 'production'

const refreshCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax' as const,
  path: '/api/auth',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30d
}

export const authController = {
  // Errors thrown here propagate to the global error handler via asyncHandler.
  signup: async (req: Request, res: Response) => {
    const validated = signupSchema.parse(req.body)
    const result = await authService.signup(validated)
    res.cookie(REFRESH_COOKIE, result.refreshToken, refreshCookieOptions)
    return res.status(201).json({
      success: true,
      data: { user: result.user, accessToken: result.accessToken },
    })
  },

  login: async (req: Request, res: Response) => {
    const validated = loginSchema.parse(req.body)
    const result = await authService.login(validated)
    res.cookie(REFRESH_COOKIE, result.refreshToken, refreshCookieOptions)
    return res.json({
      success: true,
      data: { user: result.user, accessToken: result.accessToken },
    })
  },

  refresh: async (req: Request, res: Response) => {
    // Prefer httpOnly cookie; fall back to body for non-browser clients.
    const cookieToken = (req.cookies as Record<string, string> | undefined)?.[REFRESH_COOKIE]
    const bodyToken = refreshSchema.partial().parse(req.body).refreshToken
    const token = cookieToken ?? bodyToken
    if (!token) throw AppError.unauthorized('Missing refresh token')

    const { id } = verifyRefreshToken(token)
    const user = await authRepository.findById(id)
    if (!user) throw AppError.unauthorized('Account no longer exists')

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)
    res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions)
    return res.json({ success: true, data: { user, accessToken } })
  },

  me: async (req: Request, res: Response) => {
    const current = requireUser(req)
    const user = await authService.me(current.id)
    return res.json({ success: true, data: user })
  },

  logout: async (_req: Request, res: Response) => {
    res.clearCookie(REFRESH_COOKIE, { ...refreshCookieOptions, maxAge: undefined })
    return res.json({ success: true, message: 'Logged out' })
  },
}

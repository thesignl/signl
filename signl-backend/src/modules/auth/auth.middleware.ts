import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from '../../shared/errors/errorHandler.js'
import { verifyAccessToken } from './jwt.js'

/**
 * Extracts the bearer token from the Authorization header.
 * Returns null when the header is missing or malformed.
 */
function extractBearer(req: Request): string | null {
  const header = req.headers.authorization
  if (!header || typeof header !== 'string') return null
  const [scheme, token] = header.split(' ')
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null
  return token
}

/**
 * Hard authentication. Rejects with 401 if no valid access token is present.
 * On success, populates `req.user`.
 */
export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = extractBearer(req)
  if (!token) return next(AppError.unauthorized('Missing or malformed Authorization header'))

  try {
    req.user = verifyAccessToken(token)
    return next()
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(AppError.unauthorized('Token expired'))
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return next(AppError.unauthorized('Invalid token'))
    }
    return next(AppError.unauthorized('Authentication failed'))
  }
}

/**
 * Soft authentication. Populates `req.user` if a valid token is present;
 * otherwise leaves `req.user` undefined and continues. Use for endpoints
 * that personalize for signed-in users but also serve anonymous traffic.
 */
export const optionalAuthenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = extractBearer(req)
  if (!token) return next()
  try {
    req.user = verifyAccessToken(token)
  } catch {
    // Invalid/expired token → treat as anonymous, do not surface 401.
  }
  next()
}

/**
 * Role guard. Use AFTER `authenticate`.
 * Forbids access if `req.user.role` isn't in the allowlist.
 */
export const authorize =
  (...roles: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(AppError.unauthorized())
    if (!roles.includes(req.user.role)) return next(AppError.forbidden())
    next()
  }

/**
 * Type-narrowing helper. Throws if called outside an authenticated request,
 * letting controllers depend on `user` without re-asserting on every line.
 */
export function requireUser(req: Request): Express.UserPayload {
  if (!req.user) throw AppError.unauthorized()
  return req.user
}

// Backwards-compatible export for any module that imported `AuthRequest`.
export type AuthRequest = Request & { user: Express.UserPayload }

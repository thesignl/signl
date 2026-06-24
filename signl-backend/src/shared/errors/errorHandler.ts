import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import jwt from 'jsonwebtoken'
import { Prisma } from '@prisma/client'
import { logger } from '../../infrastructure/logger/logger.js'

/**
 * AppError is the canonical operational error.
 *
 * Thrown by controllers/services for known, expected failures (validation,
 * not-found, conflict, forbidden, etc.). The error handler trusts these
 * and surfaces their `statusCode` and `message` to the client.
 *
 * Anything that isn't an AppError (or a recognized library error) is
 * treated as a programmer bug and surfaced as a generic 500 in production.
 */
export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: string
  public readonly details?: unknown
  public readonly isOperational = true

  constructor(
    statusCode: number,
    message: string,
    code = 'APP_ERROR',
    details?: unknown,
  ) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.details = details
    Error.captureStackTrace?.(this, this.constructor)
    this.name = 'AppError'
  }

  static badRequest(message = 'Bad request', details?: unknown) {
    return new AppError(400, message, 'BAD_REQUEST', details)
  }
  static unauthorized(message = 'Unauthorized') {
    return new AppError(401, message, 'UNAUTHORIZED')
  }
  static forbidden(message = 'Forbidden') {
    return new AppError(403, message, 'FORBIDDEN')
  }
  static notFound(message = 'Not found') {
    return new AppError(404, message, 'NOT_FOUND')
  }
  static conflict(message = 'Conflict') {
    return new AppError(409, message, 'CONFLICT')
  }
  static unprocessable(message = 'Unprocessable entity', details?: unknown) {
    return new AppError(422, message, 'UNPROCESSABLE', details)
  }
  static tooMany(message = 'Too many requests') {
    return new AppError(429, message, 'TOO_MANY_REQUESTS')
  }
}

interface ErrorResponse {
  success: false
  code: string
  message: string
  details?: unknown
  requestId?: string
}

const isProd = () => process.env.NODE_ENV === 'production'

/**
 * Express global error handler.
 * MUST be registered last (after all routes and the 404 handler).
 */
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  const requestId = (req as Request & { id?: string }).id

  // 1. Zod validation
  if (err instanceof ZodError) {
    const body: ErrorResponse = {
      success: false,
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: err.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
        code: i.code,
      })),
      requestId,
    }
    logger.warn('validation_error', { path: req.path, issues: body.details, requestId })
    return res.status(400).json(body)
  }

  // 2. JWT errors
  if (err instanceof jwt.TokenExpiredError) {
    return res.status(401).json({
      success: false,
      code: 'TOKEN_EXPIRED',
      message: 'Token expired',
      requestId,
    })
  }
  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({
      success: false,
      code: 'INVALID_TOKEN',
      message: 'Invalid token',
      requestId,
    })
  }

  // 3. Prisma known errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      // Unique constraint
      const target = (err.meta as { target?: string[] } | undefined)?.target
      return res.status(409).json({
        success: false,
        code: 'CONFLICT',
        message: 'Resource already exists',
        details: target ? { fields: target } : undefined,
        requestId,
      })
    }
    if (err.code === 'P2025') {
      // Record not found
      return res.status(404).json({
        success: false,
        code: 'NOT_FOUND',
        message: 'Resource not found',
        requestId,
      })
    }
    if (err.code === 'P2003') {
      // Foreign key constraint
      return res.status(400).json({
        success: false,
        code: 'FOREIGN_KEY_VIOLATION',
        message: 'Referenced resource does not exist',
        requestId,
      })
    }
    logger.error('prisma_known_error', {
      code: err.code,
      message: err.message,
      meta: err.meta,
      requestId,
    })
    return res.status(400).json({
      success: false,
      code: `PRISMA_${err.code}`,
      message: 'Database request failed',
      requestId,
    })
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    logger.error('prisma_validation_error', { message: err.message, requestId })
    return res.status(400).json({
      success: false,
      code: 'PRISMA_VALIDATION',
      message: 'Invalid database query',
      requestId,
    })
  }

  // 4. Operational AppError
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error('app_error', {
        message: err.message,
        code: err.code,
        statusCode: err.statusCode,
        stack: err.stack,
        requestId,
      })
    } else {
      logger.warn('app_error', {
        message: err.message,
        code: err.code,
        statusCode: err.statusCode,
        path: req.path,
        requestId,
      })
    }
    return res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
      details: err.details,
      requestId,
    })
  }

  // 5. Body parser / payload errors (Express built-ins)
  const e = err as { type?: string; status?: number; message?: string }
  if (e.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      code: 'PAYLOAD_TOO_LARGE',
      message: 'Request body too large',
      requestId,
    })
  }

  // 6. Unknown / programmer error → 500, never leak details in prod
  const stack = err instanceof Error ? err.stack : undefined
  const message = err instanceof Error ? err.message : String(err)
  logger.error('unhandled_error', {
    message,
    stack,
    path: req.path,
    method: req.method,
    requestId,
  })

  return res.status(500).json({
    success: false,
    code: 'INTERNAL_ERROR',
    message: isProd() ? 'Internal server error' : message,
    requestId,
  })
}

/**
 * 404 handler — register AFTER all routes, BEFORE errorHandler.
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    code: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`,
  })
}

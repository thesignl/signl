import { Request, Response, NextFunction, RequestHandler } from 'express'

/**
 * Wraps an async route handler so any thrown error or rejected promise is
 * forwarded to Express's error-handling middleware (the global errorHandler).
 * Without this, a rejected promise in an async handler would be unhandled.
 */
export const asyncHandler =
  (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
  ): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }

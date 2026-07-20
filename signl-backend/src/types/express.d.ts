import 'express'

declare global {
  namespace Express {
    export interface UserPayload {
      id: string
      email: string
      role: string
    }

    interface Request {
      // Optional: only present after `authenticate` middleware succeeds.
      // Use `requireAuth(req)` from auth.middleware to assert presence.
      user?: UserPayload
      id?: string
    }
  }
}

export {}

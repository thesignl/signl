import 'express'

declare global {
  namespace Express {
    export interface UserPayload {
      id: string
      email: string
      role: string
    }

    interface Request {
      user: UserPayload
    }
  }
}

export {}
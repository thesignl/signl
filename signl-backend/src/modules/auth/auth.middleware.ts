import {
  Request,
  Response,
  NextFunction
} from 'express'

import jwt from 'jsonwebtoken'

export const authorize =
(...roles: string[]) => {

  return (
    req: Request,

    res: Response,

    next: NextFunction
  ) => {

    if (
      !req.user ||
      !roles.includes(req.user.role)
    ) {

      return res.status(403).json({

        success: false,

        message: 'Forbidden'
      })
    }

    next()
  }
}

export interface AuthRequest extends Request {
  user: any
}

export const authenticate =
(
  req: AuthRequest,

  res: Response,

  next: NextFunction
) => {

  const authHeader =
    req.headers.authorization

  if (!authHeader) {

    return res.status(401).json({

      success: false,

      message: 'Unauthorized'
    })
  }

  const token =
    authHeader.split(' ')[1]

  try {

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET!
      )

      if(typeof decoded === 'string') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        })
      }

    req.user = decoded as Express.UserPayload

    next()

  } catch {

    return res.status(401).json({

      success: false,

      message: 'Invalid token'
    })
  }
}

export const optionalAuthenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  req.user = null
  const authHeader = req.headers.authorization
  if (!authHeader) return next()

  const token = authHeader.split(' ')[1]
  if (!token) return next()

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!)
    if (typeof decoded !== 'string') {
      req.user = decoded as Express.UserPayload
    }
  } catch {
    // invalid token — treat as anonymous
  }

  next()
}
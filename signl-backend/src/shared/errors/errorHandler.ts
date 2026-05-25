import {
  Request,
  Response,
  NextFunction
} from 'express'

export const errorHandler = (

  err: any,

  _: Request,

  res: Response,

  __: NextFunction

) => {

  console.error(err)

  return res.status(500).json({

    success: false,

    message:
      err.message ||
      'Internal server error'
  })
}
import { Request, Response }
from 'express'

import { authService }
from './auth.service.js'

import {
  signupSchema,
  loginSchema
}
from './auth.validation.js'

export const authController = {

  signup: async (
    req: Request,
    res: Response
  ) => {

    try {

      const validated =
        signupSchema.parse(req.body)

      const result =
        await authService.signup(
          validated
        )

      return res.status(201).json({

        success: true,

        data: result
      })

    } catch (error: any) {

      return res.status(400).json({

        success: false,

        message: error.message
      })
    }
  },

  login: async (
    req: Request,
    res: Response
  ) => {

    try {

      const validated =
        loginSchema.parse(req.body)

      const result =
        await authService.login(
          validated
        )

      return res.json({

        success: true,

        data: result
      })

    } catch (error: any) {

      return res.status(401).json({

        success: false,

        message: error.message
      })
    }
  }
}
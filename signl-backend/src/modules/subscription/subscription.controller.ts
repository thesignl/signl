import { Request, Response, NextFunction } from 'express'
import { subscriptionService } from './subscription.service.js'
import { checkoutSchema, verifySchema } from './subscription.validation.js'
import { errorHandler } from '../../shared/errors/errorHandler.js'
import { AuthRequest } from '../auth/auth.middleware.js'

export const subscriptionController = {
  getStatus: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const status = await subscriptionService.getStatus(req.user.id as string)
      return res.status(200).json({ success: true, data: status })
    } catch (error) {
      return errorHandler(error, req, res, next)
    }
  },

  getPlans: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const plans = subscriptionService.getPlans()
      return res.status(200).json({ success: true, data: plans })
    } catch (error) {
      return errorHandler(error, _req as AuthRequest, res, next)
    }
  },

  checkout: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = checkoutSchema.safeParse(req.body)
      if (!parsed.success) {
        return res.status(422).json({
          success: false,
          message: parsed.error.issues[0]?.message ?? 'Invalid plan.',
        })
      }
      const result = await subscriptionService.initiateCheckout(
        req.user.id as string,
        parsed.data.plan
      )
      return res.status(200).json({ success: true, data: result })
    } catch (error: any) {
      if (error?.status === 422) {
        return res.status(422).json({ success: false, message: error.message })
      }
      return errorHandler(error, req, res, next)
    }
  },

  verify: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = verifySchema.safeParse(req.body)
      if (!parsed.success) {
        return res.status(422).json({
          success: false,
          message: parsed.error.issues[0]?.message ?? 'Invalid verification data.',
        })
      }
      const result = await subscriptionService.verifyPayment(req.user.id as string, parsed.data)
      return res.status(200).json({ success: true, data: result })
    } catch (error: any) {
      if (error?.status === 422 || error?.status === 403 || error?.status === 404) {
        return res.status(error.status).json({ success: false, message: error.message })
      }
      return errorHandler(error, req, res, next)
    }
  },

  cancel: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await subscriptionService.cancel(req.user.id as string)
      return res.status(200).json({ success: true, data: result })
    } catch (error: any) {
      if (error?.status === 422) {
        return res.status(422).json({ success: false, message: error.message })
      }
      return errorHandler(error, req, res, next)
    }
  },
}

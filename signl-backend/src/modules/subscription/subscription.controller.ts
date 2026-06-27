import { Request, Response, NextFunction } from 'express'
import { subscriptionService } from './subscription.service.js'
import { checkoutSchema, verifySchema } from './subscription.validation.js'
import { requireUser } from '../auth/auth.middleware.js'
import { errorHandler } from '../../shared/errors/errorHandler.js'

export const subscriptionController = {
  getStatus: async (req: Request, res: Response) => {
    const user = requireUser(req)
    const status = await subscriptionService.getStatus(user.id)
    return res.status(200).json({ success: true, data: status })
  },

  getPlans: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const plans = subscriptionService.getPlans()
      return res.status(200).json({ success: true, data: plans })
    } catch (error) {
      return errorHandler(error, _req, res, next)
    }
  },

  checkout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = requireUser(req)
      const parsed = checkoutSchema.safeParse(req.body)
      if (!parsed.success) {
        return res.status(422).json({
          success: false,
          message: parsed.error.issues[0]?.message ?? 'Invalid plan.',
        })
      }
      const result = await subscriptionService.initiateCheckout(
        user.id,
        parsed.data.plan,
      )
      return res.status(200).json({ success: true, data: result })
    } catch (error: unknown) {
      const e = error as { status?: number; message?: string }
      if (e?.status === 422) {
        return res.status(422).json({ success: false, message: e.message })
      }
      return errorHandler(error, req, res, next)
    }
  },

  verify: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = requireUser(req)
      const parsed = verifySchema.safeParse(req.body)
      if (!parsed.success) {
        return res.status(422).json({
          success: false,
          message: parsed.error.issues[0]?.message ?? 'Invalid verification data.',
        })
      }
      const result = await subscriptionService.verifyPayment(user.id, parsed.data)
      return res.status(200).json({ success: true, data: result })
    } catch (error: unknown) {
      const e = error as { status?: number; message?: string }
      if (e?.status === 422 || e?.status === 403 || e?.status === 404) {
        return res.status(e.status).json({ success: false, message: e.message })
      }
      return errorHandler(error, req, res, next)
    }
  },

  cancel: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = requireUser(req)
      const result = await subscriptionService.cancel(user.id)
      return res.status(200).json({ success: true, data: result })
    } catch (error: unknown) {
      const e = error as { status?: number; message?: string }
      if (e?.status === 422) {
        return res.status(422).json({ success: false, message: e.message })
      }
      return errorHandler(error, req, res, next)
    }
  },
}

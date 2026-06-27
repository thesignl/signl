import { Request, Response } from 'express'
import { subscriptionService } from './subscription.service.js'
import { checkoutSchema, verifySchema } from './subscription.validation.js'
import { requireUser } from '../auth/auth.middleware.js'

// All handlers throw AppError on failure; the global error handler (wired
// in app.ts) maps them to the correct HTTP response. Routes wrap these with
// asyncHandler so rejected promises reach the handler.
export const subscriptionController = {
  getStatus: async (req: Request, res: Response) => {
    const user = requireUser(req)
    const status = await subscriptionService.getStatus(user.id)
    return res.status(200).json({ success: true, data: status })
  },

  getPlans: async (_req: Request, res: Response) => {
    const plans = subscriptionService.getPlans()
    return res.status(200).json({ success: true, data: plans })
  },

  checkout: async (req: Request, res: Response) => {
    const user = requireUser(req)
    const { plan } = checkoutSchema.parse(req.body)
    const result = await subscriptionService.initiateCheckout(user.id, plan)
    return res.status(200).json({ success: true, data: result })
  },

  verify: async (req: Request, res: Response) => {
    const user = requireUser(req)
    const data = verifySchema.parse(req.body)
    const result = await subscriptionService.verifyPayment(user.id, data)
    return res.status(200).json({ success: true, data: result })
  },

  cancel: async (req: Request, res: Response) => {
    const user = requireUser(req)
    const result = await subscriptionService.cancel(user.id)
    return res.status(200).json({ success: true, data: result })
  },
}

import { Request, Response } from 'express'
import { subscriptionService } from './subscription.service.js'
import { requireUser } from '../auth/auth.middleware.js'

export const subscriptionController = {
  getStatus: async (req: Request, res: Response) => {
    const user = requireUser(req)
    const status = await subscriptionService.getStatus(user.id)
    return res.status(200).json({ success: true, data: status })
  },
}

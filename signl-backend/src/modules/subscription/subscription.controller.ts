import { Response, NextFunction } from 'express'
import { subscriptionService } from './subscription.service.js'
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
}

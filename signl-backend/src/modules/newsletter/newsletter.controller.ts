import { Request, Response } from 'express'

import { subscribeSchema } from './newsletter.validation.js'
import { newsletterService } from './newsletter.service.js'

export const newsletterController = {
  subscribe: async (req: Request, res: Response) => {
    const validated = subscribeSchema.parse(req.body)
    await newsletterService.subscribe(validated.email)
    return res.json({
      success: true,
      message: 'Subscribed successfully',
    })
  },
}

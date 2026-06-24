import { z } from 'zod'

export const checkoutSchema = z.object({
  plan: z.literal('PRO'),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>

export const verifySchema = z.object({
  razorpayOrderId: z.string().min(1, 'razorpayOrderId is required'),
  razorpayPaymentId: z.string().min(1, 'razorpayPaymentId is required'),
  razorpaySignature: z.string().min(1, 'razorpaySignature is required'),
})

export type VerifyPaymentInput = z.infer<typeof verifySchema>

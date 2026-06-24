export type SubscriptionStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED'
export type PlanId = 'FREE' | 'PRO'

export interface SubscriptionState {
  subscribed: boolean
  status: SubscriptionStatus | null
  plan: string | null
  startedAt: string | null
  expiresAt: string | null
  cancelledAt: string | null
}

export interface PlanDefinition {
  id: PlanId
  name: string
  description: string
  price: number
  currency: string
  interval: 'monthly' | null
  features: string[]
}

export interface CheckoutResult {
  razorpayOrderId: string
  razorpayKeyId: string
  amount: number
  currency: string
  plan: PlanId
}

export interface VerifyPaymentInput {
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
}

export interface CancelResult {
  cancelled: boolean
  accessUntil: string | null
}

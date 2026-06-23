export type SubscriptionStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED'

export interface SubscriptionState {
  subscribed: boolean
  status: SubscriptionStatus | null
  plan: string | null
  expiresAt: string | null
}

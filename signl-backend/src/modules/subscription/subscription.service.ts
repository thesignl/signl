import { subscriptionRepository } from './subscription.repository.js'

export const subscriptionService = {
  /**
   * Single entitlement check — the only place in the codebase that decides
   * whether a user has premium access. Returns false for all users in Phase A
   * because no subscription rows exist yet. When Razorpay writes an ACTIVE row
   * (Phase F), this automatically returns true for that user with no code change.
   */
  isSubscribed: async (userId: string): Promise<boolean> => {
    const subscription = await subscriptionRepository.findActiveByUserId(userId)
    return subscription !== null
  },

  getStatus: async (userId: string) => {
    const subscription = await subscriptionRepository.findLatestByUserId(userId)
    if (!subscription) {
      return {
        subscribed: false,
        status: null,
        plan: null,
        expiresAt: null,
      }
    }
    const active =
      subscription.status === 'ACTIVE' &&
      (subscription.expiresAt === null || subscription.expiresAt > new Date())
    return {
      subscribed: active,
      status: subscription.status as string,
      plan: subscription.plan,
      expiresAt: subscription.expiresAt?.toISOString() ?? null,
    }
  },
}

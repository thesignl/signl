import { subscriptionRepository } from './subscription.repository.js'
import { paymentRepository } from './payment.repository.js'
import { razorpayClient } from './razorpay.client.js'
import {
  PLAN_DEFINITIONS,
  PLANS,
  PRO_PLAN_DURATION_DAYS,
  type SubscriptionPlan,
} from './plan.config.js'
import type { VerifyPaymentInput } from './subscription.validation.js'

export const subscriptionService = {
  /**
   * Single entitlement gate for premium article access.
   * Returns true for ACTIVE subscriptions and CANCELLED subscriptions still
   * within their paid period (grace access). This is the only place that decides
   * whether a user sees premium content — article.service.ts calls this directly.
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
        plan: 'FREE' as SubscriptionPlan,
        status: null,
        startedAt: null,
        expiresAt: null,
        cancelledAt: null,
      }
    }

    const active =
      (subscription.status === 'ACTIVE' || subscription.status === 'CANCELLED') &&
      (subscription.expiresAt === null || subscription.expiresAt > new Date())

    return {
      subscribed: active,
      plan: active ? (subscription.plan as SubscriptionPlan) : ('FREE' as SubscriptionPlan),
      status: subscription.status as string,
      startedAt: subscription.startedAt.toISOString(),
      expiresAt: subscription.expiresAt?.toISOString() ?? null,
      cancelledAt: subscription.cancelledAt?.toISOString() ?? null,
    }
  },

  getPlans: () => {
    return PLAN_DEFINITIONS
  },

  initiateCheckout: async (userId: string, plan: SubscriptionPlan) => {
    if (plan === 'FREE') {
      throw Object.assign(new Error('FREE plan does not require checkout.'), { status: 422 })
    }

    // Block checkout for any user who still has live access — ACTIVE or CANCELLED-in-grace.
    const existing = await subscriptionRepository.findActiveByUserId(userId)
    if (existing) {
      const msg =
        existing.status === 'CANCELLED'
          ? `Your subscription is cancelled but Pro access remains until ${
              existing.expiresAt?.toISOString() ?? 'end of period'
            }. You can resubscribe after that date.`
          : 'You already have an active Pro subscription.'
      throw Object.assign(new Error(msg), { status: 422 })
    }

    const planDef = PLANS[plan]

    // Create Razorpay order
    const receipt = `rcpt_${userId.slice(-8)}_${Date.now()}`
    const order = await razorpayClient.createOrder(planDef.price, planDef.currency, receipt)

    // Create a PENDING subscription row — activated when payment is verified
    const subscription = await subscriptionRepository.create({
      userId,
      plan,
      status: 'PENDING',
      razorpayOrderId: order.id,
    })

    // Track the payment intent
    await paymentRepository.create({
      userId,
      subscriptionId: subscription.id,
      amount: planDef.price,
      currency: planDef.currency,
      razorpayOrderId: order.id,
    })

    return {
      razorpayOrderId: order.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID as string,
      amount: planDef.price,
      currency: planDef.currency,
      plan,
    }
  },

  verifyPayment: async (userId: string, data: VerifyPaymentInput) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = data

    if (!razorpayClient.verifyOrderSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
      throw Object.assign(new Error('Invalid payment signature.'), { status: 422 })
    }

    const payment = await paymentRepository.findByRazorpayOrderId(razorpayOrderId)
    if (!payment) {
      throw Object.assign(new Error('Payment record not found.'), { status: 404 })
    }

    if (payment.userId !== userId) {
      throw Object.assign(new Error('Payment does not belong to this account.'), { status: 403 })
    }

    // Idempotent — already activated
    if (payment.status === 'CAPTURED') {
      return { verified: true }
    }

    await paymentRepository.updateStatus(payment.id, 'CAPTURED', { razorpayPaymentId })

    if (payment.subscriptionId) {
      const startedAt = new Date()
      const expiresAt = new Date(startedAt)
      expiresAt.setDate(expiresAt.getDate() + PRO_PLAN_DURATION_DAYS)

      await subscriptionRepository.update(payment.subscriptionId, {
        status: 'ACTIVE',
        startedAt,
        expiresAt,
        razorpayPaymentId,
      })
    }

    return { verified: true }
  },

  cancel: async (userId: string) => {
    const subscription = await subscriptionRepository.findActiveByUserId(userId)

    if (!subscription) {
      throw Object.assign(new Error('No active subscription found.'), { status: 422 })
    }

    if (subscription.status === 'CANCELLED') {
      throw Object.assign(
        new Error(
          `Subscription is already cancelled. Access continues until ${
            subscription.expiresAt?.toISOString() ?? 'end of period'
          }.`
        ),
        { status: 422 }
      )
    }

    await subscriptionRepository.cancelSubscription(subscription.id)

    return {
      cancelled: true,
      accessUntil: subscription.expiresAt?.toISOString() ?? null,
    }
  },
}

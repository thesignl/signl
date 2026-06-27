import prisma from '../../infrastructure/prisma/client.js'
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
import { AppError } from '../../shared/errors/errorHandler.js'

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
      throw AppError.unprocessable('FREE plan does not require checkout.')
    }

    // Block checkout for any user who still has live access — ACTIVE or
    // CANCELLED-in-grace. Also blocks PENDING-in-flight to prevent duplicate
    // checkouts on rapid double-click.
    const existing = await subscriptionRepository.findActiveByUserId(userId)
    if (existing) {
      const msg =
        existing.status === 'CANCELLED'
          ? `Your subscription is cancelled but Pro access remains until ${
              existing.expiresAt?.toISOString() ?? 'end of period'
            }. You can resubscribe after that date.`
          : 'You already have an active Pro subscription.'
      throw AppError.unprocessable(msg)
    }

    const planDef = PLANS[plan]
    const keyId = process.env.RAZORPAY_KEY_ID
    if (!keyId) {
      // Surfaces as 503 via AppError — the same outcome as the razorpay
      // client's getInstance() guard, but caught here before any side effects.
      throw new AppError(503, 'Payment processing is not configured. Contact support.', 'PAYMENT_NOT_CONFIGURED')
    }

    // Create Razorpay order
    const receipt = `rcpt_${userId.slice(-8)}_${Date.now()}`
    const order = await razorpayClient.createOrder(planDef.price, planDef.currency, receipt)

    // Persist subscription + payment intent atomically so we never leave an
    // orphan row if either insert fails.
    const { subscription } = await prisma.$transaction(async (tx) => {
      const subscription = await tx.subscription.create({
        data: {
          userId,
          plan,
          status: 'PENDING',
          razorpayOrderId: order.id,
        },
      })
      await tx.payment.create({
        data: {
          userId,
          subscriptionId: subscription.id,
          amount: planDef.price,
          currency: planDef.currency,
          razorpayOrderId: order.id,
          status: 'PENDING',
        },
      })
      return { subscription }
    })

    return {
      razorpayOrderId: order.id,
      razorpayKeyId: keyId,
      amount: planDef.price,
      currency: planDef.currency,
      plan,
      subscriptionId: subscription.id,
    }
  },

  verifyPayment: async (userId: string, data: VerifyPaymentInput) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = data

    // Signature verification is purely cryptographic — no DB access — so we
    // do it first and fail fast on tampered/wrong-length input.
    if (!razorpayClient.verifyOrderSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
      throw AppError.unprocessable('Invalid payment signature.')
    }

    const payment = await paymentRepository.findByRazorpayOrderId(razorpayOrderId)
    if (!payment) {
      throw AppError.notFound('Payment record not found.')
    }

    if (payment.userId !== userId) {
      throw AppError.forbidden('Payment does not belong to this account.')
    }

    // Idempotent — already activated. Safe to call /verify multiple times
    // (the Razorpay client SDK retries on the browser side in some flows).
    if (payment.status === 'CAPTURED') {
      return { verified: true }
    }

    // Activate the subscription and capture the payment in a single
    // transaction. Without this, a DB hiccup between the two writes would
    // leave the payment CAPTURED but the subscription PENDING — user paid,
    // but no access. The transaction guarantees both flip or neither does.
    const startedAt = new Date()
    const expiresAt = new Date(startedAt)
    expiresAt.setDate(expiresAt.getDate() + PRO_PLAN_DURATION_DAYS)

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: 'CAPTURED', razorpayPaymentId },
      })
      if (payment.subscriptionId) {
        await tx.subscription.update({
          where: { id: payment.subscriptionId },
          data: {
            status: 'ACTIVE',
            startedAt,
            expiresAt,
            razorpayPaymentId,
          },
        })
      }
    })

    return { verified: true }
  },

  cancel: async (userId: string) => {
    const subscription = await subscriptionRepository.findActiveByUserId(userId)

    if (!subscription) {
      throw AppError.unprocessable('No active subscription found.')
    }

    if (subscription.status === 'CANCELLED') {
      throw AppError.unprocessable(
        `Subscription is already cancelled. Access continues until ${
          subscription.expiresAt?.toISOString() ?? 'end of period'
        }.`,
      )
    }

    await subscriptionRepository.cancelSubscription(subscription.id)

    return {
      cancelled: true,
      accessUntil: subscription.expiresAt?.toISOString() ?? null,
    }
  },
}

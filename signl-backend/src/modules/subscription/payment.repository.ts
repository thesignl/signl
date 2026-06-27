import prisma from '../../infrastructure/prisma/client.js'
import type { PaymentStatus } from '@prisma/client'

export const paymentRepository = {
  create: async (data: {
    userId: string
    subscriptionId?: string
    amount: number
    currency?: string
    razorpayOrderId?: string
  }) => {
    return prisma.payment.create({
      data: {
        userId: data.userId,
        subscriptionId: data.subscriptionId,
        amount: data.amount,
        currency: data.currency ?? 'INR',
        razorpayOrderId: data.razorpayOrderId,
        status: 'PENDING',
      },
    })
  },

  findById: async (id: string) => {
    return prisma.payment.findUnique({ where: { id } })
  },

  findByRazorpayOrderId: async (orderId: string) => {
    return prisma.payment.findUnique({ where: { razorpayOrderId: orderId } })
  },

  updateStatus: async (
    id: string,
    status: PaymentStatus,
    extra?: { razorpayPaymentId?: string; failureReason?: string }
  ) => {
    return prisma.payment.update({
      where: { id },
      data: { status, ...extra },
    })
  },
}

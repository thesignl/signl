import prisma from '../../infrastructure/prisma/client.js'
import { Prisma } from '@prisma/client'

export const subscriptionRepository = {
  findActiveByUserId: async (userId: string) => {
    return prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  findLatestByUserId: async (userId: string) => {
    return prisma.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  },

  create: async (data: {
    userId: string
    plan: string
    status?: 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED'
    expiresAt?: Date | null
    razorpayOrderId?: string
    razorpayPaymentId?: string
    razorpaySubscriptionId?: string
  }) => {
    return prisma.subscription.create({ data })
  },

  update: async (id: string, data: Partial<{
    status: 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED'
    expiresAt: Date | null
    razorpayPaymentId: string
    razorpaySubscriptionId: string
  }>) => {
    return prisma.subscription.update({ where: { id }, data })
  },

  listAll: async (filters: { status?: string; page: number; limit: number }) => {
    const where: Prisma.SubscriptionWhereInput = {}
    if (filters.status) where.status = filters.status as Prisma.EnumSubscriptionStatusFilter['equals']

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      }),
      prisma.subscription.count({ where }),
    ])

    return { subscriptions, total }
  },
}

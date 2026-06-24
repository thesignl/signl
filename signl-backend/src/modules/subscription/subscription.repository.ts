import prisma from '../../infrastructure/prisma/client.js'

export const subscriptionRepository = {
  // Includes CANCELLED subscriptions still within their paid period (grace access).
  // Phase A bug fix: status was 'ACTIVE' only, which cut off cancelled users immediately.
  findActiveByUserId: async (userId: string) => {
    return prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: ['ACTIVE', 'CANCELLED'] },
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

  update: async (
    id: string,
    data: Partial<{
      status: 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED'
      startedAt: Date
      expiresAt: Date | null
      razorpayPaymentId: string
      razorpaySubscriptionId: string
    }>
  ) => {
    return prisma.subscription.update({ where: { id }, data })
  },

  cancelSubscription: async (id: string) => {
    return prisma.subscription.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    })
  },

  listAll: async (filters: { status?: string; page: number; limit: number }) => {
    const where: any = {}
    if (filters.status) where.status = filters.status

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

import prisma from '../../infrastructure/prisma/client.js'

export const newsletterService = {
  subscribe: async (email: string) => {
    const normalized = email.toLowerCase().trim()

    // Idempotent: re-subscribing is a no-op success, not an error.
    // upsert avoids a race between the existence check and the insert.
    await prisma.newsletterSubscriber.upsert({
      where: { email: normalized },
      update: {},
      create: { email: normalized },
    })

    return { email: normalized }
  },
}

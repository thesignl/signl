import prisma
from '../../infrastructure/prisma/client.js'

export const newsletterService = {

  subscribe: async (
    email: string
  ) => {

    const existing =

      await prisma.newsletterSubscriber.findUnique({

        where: {
          email
        }
      })

    if (existing) {

      throw new Error(
        'Already subscribed'
      )
    }

    return prisma.newsletterSubscriber.create({

      data: {
        email
      }
    })
  }
}
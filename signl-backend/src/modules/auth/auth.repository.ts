import prisma
from '../../infrastructure/prisma/client.js'

export const authRepository = {

  findByEmail: async (
    email: string
  ) => {

    return prisma.user.findUnique({

      where: { email }
    })
  },

  createUser: async (
    data: any
  ) => {

    return prisma.user.create({

      data
    })
  }
}
import prisma from '../../infrastructure/prisma/client.js'
import type { SafeUser } from './auth.types.js'

/** Fields safe to return to clients — explicitly excludes `password`. */
export const safeUserSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  avatar: true,
  slug: true,
  title: true,
  bio: true,
  emailVerified: true,
  createdAt: true,
} as const

export const authRepository = {
  /** Includes password — use ONLY for credential verification, never returned to clients. */
  findByEmailWithPassword: async (email: string) => {
    return prisma.user.findUnique({ where: { email } })
  },

  findByEmail: async (email: string): Promise<SafeUser | null> => {
    return prisma.user.findUnique({
      where: { email },
      select: safeUserSelect,
    })
  },

  findById: async (id: string): Promise<SafeUser | null> => {
    return prisma.user.findUnique({
      where: { id },
      select: safeUserSelect,
    })
  },

  createUser: async (data: {
    name: string
    email: string
    password: string
  }): Promise<SafeUser> => {
    return prisma.user.create({
      data,
      select: safeUserSelect,
    })
  },
}

import bcrypt from 'bcrypt'

import { authRepository } from './auth.repository.js'
import { generateAccessToken, generateRefreshToken } from './jwt.js'
import { AppError } from '../../shared/errors/errorHandler.js'
import type { SignupInput, LoginInput, AuthResult } from './auth.types.js'

const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS ?? 12)

export const authService = {
  signup: async (data: SignupInput): Promise<AuthResult> => {
    const email = data.email.toLowerCase().trim()

    const existing = await authRepository.findByEmail(email)
    if (existing) {
      throw AppError.conflict('An account with this email already exists')
    }

    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_ROUNDS)

    const user = await authRepository.createUser({
      name: data.name.trim(),
      email,
      password: hashedPassword,
    })

    return {
      user,
      accessToken: generateAccessToken(user),
      refreshToken: generateRefreshToken(user),
    }
  },

  login: async (data: LoginInput): Promise<AuthResult> => {
    const email = data.email.toLowerCase().trim()

    const account = await authRepository.findByEmailWithPassword(email)

    // Always run a bcrypt compare to keep response timing uniform whether or
    // not the account exists (mitigates user-enumeration via timing).
    const hash =
      account?.password ??
      '$2b$12$0000000000000000000000000000000000000000000000000000a'
    const isValid = await bcrypt.compare(data.password, hash)

    if (!account || !isValid) {
      throw AppError.unauthorized('Invalid email or password')
    }

    const user = {
      id: account.id,
      email: account.email,
      name: account.name,
      role: account.role,
      avatar: account.avatar,
      slug: account.slug,
      title: account.title,
      bio: account.bio,
      emailVerified: account.emailVerified,
      createdAt: account.createdAt,
    }

    return {
      user,
      accessToken: generateAccessToken(user),
      refreshToken: generateRefreshToken(user),
    }
  },

  me: async (userId: string) => {
    const user = await authRepository.findById(userId)
    if (!user) throw AppError.notFound('User not found')
    return user
  },
}

import bcrypt from 'bcrypt'

import { authRepository }
from './auth.repository.js'

import {
  generateAccessToken
}
from './jwt.js'

export const authService = {

  signup: async (
    data: any
  ) => {

    const existing =
      await authRepository.findByEmail(
        data.email
      )

    if (existing) {

      throw new Error(
        'Email already exists'
      )
    }

    const hashedPassword =
      await bcrypt.hash(
        data.password,
        10
      )

    const user = await authRepository.createUser({

    name: data.name,

    email: data.email,

    password: hashedPassword,
  })

    const token =
      generateAccessToken(user)

    return {

      user,

      token
    }
  },

  login: async (
    data: any
  ) => {

    const user =
      await authRepository.findByEmail(
        data.email
      )

    if (!user) {

      throw new Error(
        'Invalid credentials'
      )
    }

    const isValid =
      await bcrypt.compare(
        data.password,
        user.password
      )

    if (!isValid) {

      throw new Error(
        'Invalid credentials'
      )
    }

    const token =
      generateAccessToken(user)

    return {

      user,

      token
    }
  }
}
import api from '@/lib/axios'

interface AuthResponse {

  success: boolean

  data: {

    user: {

      id: string

      name: string

      email: string

      role: string
    }

    token: string
  }
}

export const signupUser =
async (

  name: string,

  email: string,

  password: string

) => {

  const response =
    await api.post(

      '/auth/signup',

      {
        name,
        email,
        password
      }
    )

  return response.data
}

export const loginUser =
async (

  email: string,

  password: string

): Promise<AuthResponse> => {

  const response =
    await api.post(

      '/auth/login',

      {
        email,
        password
      }
    )

  return response.data
}
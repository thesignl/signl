import api from '@/lib/axios'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  avatar?: string | null
  slug?: string | null
  title?: string | null
  bio?: string | null
  emailVerified?: boolean
}

export interface AuthResponse {
  success: boolean
  data: {
    user: AuthUser
    accessToken: string
  }
}

export const signupUser = async (
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await api.post('/auth/signup', { name, email, password })
  return response.data
}

export const loginUser = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

export const fetchMe = async (): Promise<AuthUser> => {
  const response = await api.get('/auth/me')
  return response.data.data
}

export const logoutUser = async (): Promise<void> => {
  await api.post('/auth/logout', {})
}

export interface SignupInput {
  name: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

/** Public user shape — never includes password or other secrets. */
export interface SafeUser {
  id: string
  email: string
  name: string
  role: string
  avatar: string | null
  slug: string | null
  title: string | null
  bio: string | null
  emailVerified: boolean
  createdAt: Date
}

export interface AuthResult {
  user: SafeUser
  accessToken: string
  refreshToken: string
}

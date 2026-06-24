import jwt, { SignOptions, Secret } from 'jsonwebtoken'

const ACCESS_ALGO = 'HS256' as const
const ACCESS_TTL = (process.env.JWT_ACCESS_TTL ?? '7d') as SignOptions['expiresIn']
const REFRESH_TTL = (process.env.JWT_REFRESH_TTL ?? '30d') as SignOptions['expiresIn']
const ISSUER = process.env.JWT_ISSUER ?? 'signl'
const AUDIENCE = process.env.JWT_AUDIENCE ?? 'signl-web'

export interface JwtUser {
  id: string
  email: string
  role: string
}

function getAccessSecret(): Secret {
  const s = process.env.JWT_ACCESS_SECRET
  if (!s) throw new Error('JWT_ACCESS_SECRET not configured')
  return s
}

function getRefreshSecret(): Secret {
  // Falls back to access secret with a separator so refresh tokens are still
  // cryptographically distinct even when JWT_REFRESH_SECRET isn't set.
  // Production deploys MUST set JWT_REFRESH_SECRET independently.
  const s = process.env.JWT_REFRESH_SECRET
  if (s) return s
  return `${process.env.JWT_ACCESS_SECRET ?? ''}::refresh`
}

export const generateAccessToken = (user: JwtUser): string => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    getAccessSecret(),
    {
      algorithm: ACCESS_ALGO,
      expiresIn: ACCESS_TTL,
      issuer: ISSUER,
      audience: AUDIENCE,
      subject: user.id,
    },
  )
}

export const generateRefreshToken = (user: JwtUser): string => {
  return jwt.sign(
    { id: user.id, type: 'refresh' },
    getRefreshSecret(),
    {
      algorithm: ACCESS_ALGO,
      expiresIn: REFRESH_TTL,
      issuer: ISSUER,
      audience: AUDIENCE,
      subject: user.id,
    },
  )
}

export const verifyAccessToken = (token: string): JwtUser => {
  const decoded = jwt.verify(token, getAccessSecret(), {
    algorithms: [ACCESS_ALGO],
    issuer: ISSUER,
    audience: AUDIENCE,
  })
  if (typeof decoded === 'string') throw new Error('Invalid token payload')
  const { id, email, role } = decoded as Record<string, unknown>
  if (typeof id !== 'string' || typeof email !== 'string' || typeof role !== 'string') {
    throw new Error('Invalid token payload')
  }
  return { id, email, role }
}

export const verifyRefreshToken = (token: string): { id: string } => {
  const decoded = jwt.verify(token, getRefreshSecret(), {
    algorithms: [ACCESS_ALGO],
    issuer: ISSUER,
    audience: AUDIENCE,
  })
  if (typeof decoded === 'string') throw new Error('Invalid token payload')
  const payload = decoded as Record<string, unknown>
  if (payload.type !== 'refresh' || typeof payload.id !== 'string') {
    throw new Error('Invalid refresh token')
  }
  return { id: payload.id }
}

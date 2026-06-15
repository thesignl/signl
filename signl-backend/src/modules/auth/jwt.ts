import jwt from 'jsonwebtoken'

export const generateAccessToken = (
  user: any
) => {

  return jwt.sign(

    {
      id: user.id,
      role: user.role
    },

    process.env.JWT_ACCESS_SECRET!,

    {
      // No refresh-token flow exists yet, so a short 15m access token
      // silently logged editors out mid-session. Use a workable session
      // lifetime until refresh tokens are implemented.
      expiresIn: '7d'
    }
  )
}
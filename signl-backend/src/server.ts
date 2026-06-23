import 'dotenv/config'

import app from './app.js'

const PORT = process.env.PORT || 5000

const JWT_SECRET = process.env.JWT_ACCESS_SECRET
if (!JWT_SECRET) {
  console.error('FATAL: JWT_ACCESS_SECRET is not set. Refusing to start.')
  process.exit(1)
}
if (JWT_SECRET.length < 64) {
  console.warn(
    'WARNING: JWT_ACCESS_SECRET is shorter than 64 characters. ' +
    'Generate a secure secret with: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"'
  )
}

process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection]', reason)
})

process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err)
  process.exit(1)
})

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})

import 'dotenv/config'

import app from './app.js'
import { logger } from './infrastructure/logger/logger.js'
import prisma from './infrastructure/prisma/client.js'

const PORT = Number(process.env.PORT ?? 5000)
const NODE_ENV = process.env.NODE_ENV ?? 'development'

// ── Required secrets ──────────────────────────────────────────────────────
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
if (!JWT_ACCESS_SECRET) {
  logger.error('FATAL: JWT_ACCESS_SECRET is not set. Refusing to start.')
  process.exit(1)
}
if (JWT_ACCESS_SECRET.length < 64) {
  if (NODE_ENV === 'production') {
    logger.error(
      'FATAL: JWT_ACCESS_SECRET must be at least 64 characters in production. ' +
        'Generate with: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"',
    )
    process.exit(1)
  }
  logger.warn(
    'JWT_ACCESS_SECRET is shorter than 64 characters (allowed in dev only). ' +
      'Generate a secure secret with: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"',
  )
}

if (NODE_ENV === 'production' && !process.env.CORS_ORIGIN) {
  logger.error('FATAL: CORS_ORIGIN must be set explicitly in production.')
  process.exit(1)
}

// ── Process-level safety nets ─────────────────────────────────────────────
process.on('unhandledRejection', (reason) => {
  logger.error('unhandledRejection', { reason: String(reason) })
})

process.on('uncaughtException', (err) => {
  logger.error('uncaughtException', {
    message: err.message,
    stack: err.stack,
  })
  // Exit so the process manager (PM2 / systemd) can restart cleanly.
  void shutdown(1)
})

// ── Server boot ───────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  logger.info('server_started', { port: PORT, env: NODE_ENV, pid: process.pid })
})

server.keepAliveTimeout = 65_000 // > Nginx default 60s; avoids 502 races
server.headersTimeout = 66_000

// ── Graceful shutdown ─────────────────────────────────────────────────────
let shuttingDown = false

async function shutdown(exitCode = 0) {
  if (shuttingDown) return
  shuttingDown = true
  logger.info('shutdown_initiated', { exitCode })

  // Stop accepting new connections.
  server.close((err) => {
    if (err) logger.error('http_close_error', { message: err.message })
    else logger.info('http_server_closed')
  })

  // Drain Prisma pool.
  try {
    await prisma.$disconnect()
    logger.info('prisma_disconnected')
  } catch (err) {
    logger.error('prisma_disconnect_error', {
      message: (err as Error).message,
    })
  }

  // Hard timeout — never hang forever.
  setTimeout(() => {
    logger.error('shutdown_timeout_exceeded')
    process.exit(exitCode || 1)
  }, 15_000).unref()

  process.exit(exitCode)
}

;(['SIGTERM', 'SIGINT'] as const).forEach((sig) => {
  process.on(sig, () => {
    logger.info('signal_received', { signal: sig })
    void shutdown(0)
  })
})

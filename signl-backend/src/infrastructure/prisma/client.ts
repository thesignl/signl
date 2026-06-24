import { PrismaClient, Prisma } from '@prisma/client'
import { logger } from '../logger/logger.js'

const isProd = process.env.NODE_ENV === 'production'

/**
 * PrismaClient singleton.
 *
 * - In dev with hot-reload (tsx watch / next dev), reuse a global instance
 *   to prevent connection-pool exhaustion across reloads.
 * - In prod, a fresh instance per process is correct (PM2 forks each get
 *   their own pool).
 * - Slow-query and error events are logged via winston with stable keys
 *   so they aggregate cleanly in Loki/Datadog/CloudWatch.
 */
const logLevels: Prisma.LogLevel[] = isProd
  ? ['error', 'warn']
  : ['error', 'warn', 'info']

const SLOW_QUERY_MS = Number(process.env.PRISMA_SLOW_QUERY_MS ?? 500)

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

function buildClient(): PrismaClient {
  const client = new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      ...logLevels.map((level) => ({ level, emit: 'event' as const })),
    ],
    errorFormat: isProd ? 'minimal' : 'pretty',
  }) as unknown as PrismaClient & {
    $on: (event: string, handler: (e: unknown) => void) => void
  }

  client.$on('query', (e: unknown) => {
    const evt = e as { duration: number; query: string }
    if (evt.duration >= SLOW_QUERY_MS) {
      logger.warn('prisma_slow_query', {
        durationMs: evt.duration,
        // Avoid logging full param values; query text only.
        query: evt.query,
      })
    }
  })

  client.$on('error', (e: unknown) => {
    const evt = e as { message?: string; target?: string }
    logger.error('prisma_error_event', {
      message: evt.message,
      target: evt.target,
    })
  })

  client.$on('warn', (e: unknown) => {
    const evt = e as { message?: string }
    logger.warn('prisma_warn_event', { message: evt.message })
  })

  return client as PrismaClient
}

const prisma = globalThis.__prisma ?? buildClient()

if (!isProd) {
  globalThis.__prisma = prisma
}

export default prisma

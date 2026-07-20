import winston from 'winston'

const isProd = process.env.NODE_ENV === 'production'
const level = process.env.LOG_LEVEL ?? (isProd ? 'info' : 'debug')

const redactKeys = new Set([
  'password',
  'pass',
  'token',
  'accessToken',
  'refreshToken',
  'authorization',
  'cookie',
  'set-cookie',
  'jwt',
  'secret',
  'apiKey',
  'api_key',
  'razorpaySignature',
])

function redact(value: unknown, depth = 0): unknown {
  if (depth > 6 || value == null) return value
  if (Array.isArray(value)) return value.map((v) => redact(v, depth + 1))
  if (typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = redactKeys.has(k.toLowerCase()) ? '[REDACTED]' : redact(v, depth + 1)
    }
    return out
  }
  return value
}

const redactFormat = winston.format((info) => {
  const { level: _l, message: _m, timestamp: _t, ...rest } = info
  const cleaned = redact(rest) as Record<string, unknown>
  return { ...info, ...cleaned }
})

export const logger = winston.createLogger({
  level,
  defaultMeta: { service: 'signl-backend' },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    redactFormat(),
    isProd ? winston.format.json() : winston.format.colorize({ all: false }),
    isProd
      ? winston.format.json()
      : winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length
            ? ' ' + JSON.stringify(meta)
            : ''
          return `${String(timestamp)} ${level} ${String(message)}${metaStr}`
        }),
  ),
  transports: [
    new winston.transports.Console({
      handleExceptions: false,
      handleRejections: false,
    }),
  ],
})

if (isProd) {
  logger.info('logger_initialized', { level, format: 'json' })
}

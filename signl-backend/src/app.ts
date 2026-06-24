import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { randomUUID } from 'crypto'

import articleRoutes from './modules/articles/article.routes.js'
import authRoutes from './modules/auth/auth.routes.js'
import bookmarkRoutes from './modules/bookmark/bookmark.routes.js'
import newsletterRoutes from './modules/newsletter/newsletter.routes.js'
import editorRoutes from './modules/editor/editor.routes.js'
import adminRoutes from './modules/admin/admin.routes.js'
import subscriptionRoutes from './modules/subscription/subscription.routes.js'

import { errorHandler, notFoundHandler } from './shared/errors/errorHandler.js'
import { logger } from './infrastructure/logger/logger.js'

const app = express()

const isProd = process.env.NODE_ENV === 'production'

// Behind a reverse proxy (Nginx) — trust the first hop so req.ip and rate
// limiting work correctly on Hostinger VPS.
app.set('trust proxy', 1)

// Request ID — attached to every request for log correlation. Surfaces in
// error responses via the global error handler.
app.use((req, _res, next) => {
  ;(req as express.Request & { id?: string }).id =
    (req.headers['x-request-id'] as string | undefined) ?? randomUUID()
  next()
})

// CORS — allowlist from env, comma-separated. Falls back to localhost in dev.
const corsOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow same-origin / curl / server-to-server (no Origin header).
      if (!origin) return cb(null, true)
      if (corsOrigins.includes(origin)) return cb(null, true)
      return cb(new Error(`CORS: origin ${origin} not allowed`))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
    exposedHeaders: ['X-Request-Id'],
  }),
)

// Helmet — explicit prod-grade config. CSP is intentionally loose for an
// API server (no HTML rendered); the frontend ships its own CSP.
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    hsts: isProd
      ? { maxAge: 60 * 60 * 24 * 365, includeSubDomains: true, preload: true }
      : false,
  }),
)

// Body parsers — explicit limits. JSON is the default; raw is needed for
// webhook signature verification (e.g. Razorpay).
app.use('/api/subscription/webhook', express.raw({ type: 'application/json', limit: '1mb' }))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(cookieParser())

// Compression — skip Server-Sent Events.
app.use(
  compression({
    filter: (req, res) => {
      if (req.headers['accept']?.includes('text/event-stream')) return false
      return compression.filter(req, res)
    },
  }),
)

// Request logging — winston in prod (JSON, single line), morgan dev in dev.
if (isProd) {
  app.use(
    morgan('combined', {
      stream: { write: (msg) => logger.info(msg.trim()) },
      skip: (req) => req.path === '/api/health' || req.path === '/api/ready',
    }),
  )
} else {
  app.use(morgan('dev'))
}

// ── Rate limiters ──────────────────────────────────────────────────────────
// Global default — protects against bursty noise. Generous enough not to
// hurt legitimate users.
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, code: 'TOO_MANY_REQUESTS', message: 'Too many requests' },
})

// Tight limiter for credential endpoints — brute-force defense.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    code: 'TOO_MANY_REQUESTS',
    message: 'Too many auth attempts. Try again in 15 minutes.',
  },
  // IP-based by default. Per-user keying is added in auth.routes if needed.
})

// Write limiter for newsletter / public-write endpoints.
const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, code: 'TOO_MANY_REQUESTS', message: 'Too many requests' },
})

app.use('/api/', globalLimiter)

// ── Health & readiness ─────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', ts: Date.now() })
})

// /api/ready performs a lightweight DB ping; suitable for k8s/PM2 readiness.
app.get('/api/ready', async (_req, res, next) => {
  try {
    const { default: prisma } = await import('./infrastructure/prisma/client.js')
    await prisma.$queryRaw`SELECT 1`
    res.status(200).json({ status: 'ready', ts: Date.now() })
  } catch (err) {
    next(err)
  }
})

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/articles', articleRoutes)
app.use('/api/bookmarks', bookmarkRoutes)
app.use('/api/newsletter', writeLimiter, newsletterRoutes)
app.use('/api/editor', editorRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/subscription', subscriptionRoutes)

// ── 404 + global error handler (must be last) ──────────────────────────────
app.use(notFoundHandler)
app.use(errorHandler)

export default app

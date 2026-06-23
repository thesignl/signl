import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'

import morgan from 'morgan'

import articleRoutes
from './modules/articles/article.routes.js'
import authRoutes from './modules/auth/auth.routes.js'
import bookmarkRoutes from './modules/bookmark/bookmark.routes.js'
import newsletterRoutes from './modules/newsletter/newsletter.routes.js'
import editorRoutes from './modules/editor/editor.routes.js'
import adminRoutes from './modules/admin/admin.routes.js'
import subscriptionRoutes from './modules/subscription/subscription.routes.js'

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  credentials: true,
}))

app.use(express.json())
app.use(helmet())
app.use(compression())
app.use(morgan('dev'))

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', ts: Date.now() })
})

app.use(
  '/api/auth',
  authRoutes
)

app.use(
  '/api/articles',
  articleRoutes
)


app.use(
  '/api/bookmarks',
  bookmarkRoutes
)

app.use(
  '/api/newsletter',
  newsletterRoutes
)

app.use(
  '/api/editor',
  editorRoutes
)

app.use(
 '/api/admin',
 adminRoutes
)

app.use(
  '/api/subscription',
  subscriptionRoutes
)

export default app
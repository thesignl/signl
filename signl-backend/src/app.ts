import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'

import morgan from 'morgan'

import articleRoutes
from './modules/articles/article.routes.js'
import authRoutes from './modules/auth/auth.routes.js'
import bookmarkRoutes from './modules/bookmark/bookmark.routes.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(helmet())

app.use(compression())

app.use(morgan('dev'))

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

export default app
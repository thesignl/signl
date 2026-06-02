import type { Article } from './article'

export interface Bookmark {
  userId?: string
  articleId?: string
  createdAt?: string
  article: Article
}

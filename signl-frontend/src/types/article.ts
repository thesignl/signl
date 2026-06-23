/**
 * Frontend Article type — mirrors the API response from the
 * Signl backend. The backend serializes scalar fields plus
 * `author`, `category` and (denormalized) `tags`. Long-form body
 * content is delivered as `contentText`. `blocks`, `depths` and
 * `analysisSteps` are not currently included on the public read
 * endpoints; we keep them optional so we can surface them later
 * without a type churn.
 */

export type ArticleType = 'ARTICLE' | 'ANALYSIS' | 'BRIEF' | 'LEARN'

export interface Author {
  id: string
  name: string
  bio?: string | null
  avatar?: string | null
}

export interface Category {
  id: string
  name: string
  slug?: string | null
}

export interface Tag {
  id: string
  name: string
  slug?: string | null
}

export interface ArticleTagRel {
  tag: Tag
}

export interface ContentBlock {
  id: string
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'QUOTE' | 'CODE' | 'EMBED' | 'HEADING' | 'LIST'
  content: unknown
  position: number
}

export interface Article {
  id: string
  title: string
  slug: string
  summary: string
  contentText?: string | null
  signal?: string | null
  coverImage?: string | null

  premium: boolean
  verified: boolean
  featured: boolean
  articleType: ArticleType

  readTime: number
  views: number

  publishedAt?: string | null
  createdAt: string
  updatedAt: string

  author: Author
  category: Category
  tags?: ArticleTagRel[]

  /** Optional — present only when the API includes it. */
  blocks?: ContentBlock[]

  /** True when the article is premium and the current reader is not subscribed. */
  paywalled?: boolean
}

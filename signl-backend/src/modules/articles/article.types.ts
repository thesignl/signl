export interface CreateArticleDTO {

  title: string

  slug: string

  summary: string

  content?: any

  contentText?: string

  signal?: string

  coverImage?: string

  premium: boolean

  featured?: boolean

  articleType:
    | 'ARTICLE'
    | 'ANALYSIS'
    | 'BRIEF'
    | 'LEARN'

  status:

    | 'DRAFT'
    | 'REVIEW'
    | 'PUBLISHED'
    | 'ARCHIVED'


  readTime: number

  seoTitle?: string

  seoDescription?: string

  seoKeywords?: string

  canonicalUrl?: string

  authorId: string

  categoryId: string

  updatedById?: string
}
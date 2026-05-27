export interface CreateArticleDTO {

  title: string

  slug: string

  summary: string

  content: any

  coverImage?: string

  premium: boolean

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

  authorId: string

  categoryId: string

  updatedById?: string
}
export interface Article {

  id: string

  title: string

  slug: string

  summary: string

  content: {

    type: string

    value: string

  }[]

  coverImage?: string

  premium: boolean

  verified: boolean

  articleType: string

  views: number

  createdAt: string

  author: {

    name: string
  }

  category: {

    name: string
  }
}
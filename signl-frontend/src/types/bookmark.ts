export interface Bookmark {

  id: string

  article: {

    id: string

    title: string

    slug: string

    summary: string

    premium: boolean

    verified: boolean

    readTime: number

    category: {

      name: string
    }

    author: {

      name: string
    }
  }
}
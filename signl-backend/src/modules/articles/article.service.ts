import { articleRepository }
from './article.repository.js'

import { CreateArticleDTO }
from './article.types.js'

export const articleService = {

  createArticle: async (
    data: CreateArticleDTO
  ) => {

    const existing =
      await articleRepository.findBySlug(
        data.slug
      )

    if (existing) {

      throw new Error(
        'Article slug already exists'
      )
    }

    return articleRepository.create(data)
  },

  getHomepageFeed: async () => {

    return articleRepository.findAll()
  },

  getArticleBySlug: async (
    slug: string
  ) => {

    const article =
      await articleRepository.findBySlug(
        slug
      )

    if (!article) {

      throw new Error(
        'Article not found'
      )
    }

    await articleRepository.incrementViews(
      slug
    )

    return article
  }
}
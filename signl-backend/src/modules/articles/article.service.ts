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
  },

  getAnalysisFeed: async () => {

    return articleRepository
      .getAnalysisArticles()
  },
  
  searchArticles: async (
    query: string
  ) => {

    if (!query) {

      return []
    }

    return articleRepository.search(
      query
    )
  },

  updateArticle: async (

    articleId: string,

    data: any,

    user: any

  ) => {

    const verified = user.role === 'ADMIN'

    return articleRepository.update(

      articleId,

      {

        ...data,

        verified,

        updatedById: user.id
      }
    )
  },

  publishArticle: async (

    articleId: string,

    user: any

  ) => {

    const verified = (user.role === 'ADMIN');

    return articleRepository.update(

      articleId,

      {

        status: 'PUBLISHED',

        verified,

        publishedAt: new Date(),

        updatedById: user.id
      }
    )
  },

  unpublishArticle: async (
    articleId: string
  ) => {

    return articleRepository.update(

      articleId,

      {
        status: 'DRAFT'
      }
    )
  },

  deleteArticle: async (
    articleId: string
  ) => {

    return articleRepository.delete(
      articleId
    )
  },

  getBriefArticles: async () => {

    return articleRepository.getBriefs()
  },

  getAnalysisArticles: async () => {

    return articleRepository.getAnalysis()
  },

  getFeaturedArticle: async () => {

    return articleRepository.getFeatured()
  },

  getLearnFeed: async () => {

  return articleRepository
      .getLearnArticles()
  },

}
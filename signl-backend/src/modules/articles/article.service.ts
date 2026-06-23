import { articleRepository }
from './article.repository.js'

import { CreateArticleDTO }
from './article.types.js'

import { subscriptionService } from '../subscription/subscription.service.js'

export const articleService = {

  createArticle: async (
    data: any,
    user: any
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

    // EDITOR is always the author of their own article.
    // ADMIN may supply an explicit authorId; falls back to their own id.
    const authorId = user.role === 'EDITOR'
      ? user.id
      : (data.authorId ?? user.id)

    return articleRepository.create({
      ...data,
      authorId,
      status: 'DRAFT',
    })
  },

  getHomepageFeed: async () => {

    return articleRepository.findAll()
  },

  getArticleBySlug: async (
    slug: string,
    actor: { id: string; role: string } | null
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

    if (article.premium) {
      const subscribed = actor
        ? await subscriptionService.isSubscribed(actor.id)
        : false

      if (!subscribed) {
        return {
          ...article,
          contentText: article.contentText?.slice(0, 350) ?? '',
          signal: null,
          blocks: [],
          paywalled: true,
        }
      }
    }

    return { ...article, paywalled: false }
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

    const article = await articleRepository.findById(articleId)
    if (!article) throw new Error('Article not found')
    if (user.role !== 'ADMIN' && article.authorId !== user.id) {
      throw new Error('Unauthorized: you can only edit your own articles')
    }

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

    const article = await articleRepository.findById(articleId)
    if (!article) throw new Error('Article not found')
    if (user.role !== 'ADMIN' && article.authorId !== user.id) {
      throw new Error('Unauthorized: you can only publish your own articles')
    }

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
    articleId: string,
    user: any
  ) => {

    const article = await articleRepository.findById(articleId)
    if (!article) throw new Error('Article not found')
    if (user.role !== 'ADMIN' && article.authorId !== user.id) {
      throw new Error('Unauthorized: you can only unpublish your own articles')
    }

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
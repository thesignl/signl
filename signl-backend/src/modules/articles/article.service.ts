import { articleRepository }
from './article.repository.js'

import { CreateArticleDTO }
from './article.types.js'

import { subscriptionService } from '../subscription/subscription.service.js'
import { AppError } from '../../shared/errors/errorHandler.js'
import type { CreateArticleInput, UpdateArticleInput } from './article.validation.js'

interface Actor { id: string; role: string }

export const articleService = {

  createArticle: async (
    data: CreateArticleInput,
    user: Actor
  ) => {

    if (data.slug) {
      const existing = await articleRepository.findBySlug(data.slug)
      if (existing) {
        throw AppError.conflict('Article slug already exists')
      }
    }

    // EDITOR is always the author of their own article.
    // ADMIN may supply an explicit authorId; falls back to their own id.
    const authorId = user.role === 'EDITOR'
      ? user.id
      : (data.authorId ?? user.id)

    // `content` is an editor-side convenience field with no Article column;
    // the body persists via contentText / ContentBlock rows. Strip it before
    // handing the payload to Prisma.
    const { content: _content, authorId: _authorId, ...rest } = data

    return articleRepository.create({
      ...rest,
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
      throw AppError.notFound('Article not found')
    }

    // Fire-and-forget, accuracy-aware view recording — never block or fail
    // the read on it. Logged-in readers are deduped (one view per reader);
    // anonymous reads are best-effort.
    void articleRepository
      .recordView(article.id, slug, actor?.id ?? null)
      .catch(() => {})

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

    data: UpdateArticleInput,

    user: Actor

  ) => {

    const article = await articleRepository.findById(articleId)
    if (!article) throw AppError.notFound('Article not found')
    if (user.role !== 'ADMIN' && article.authorId !== user.id) {
      throw AppError.forbidden('You can only edit your own articles')
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

    user: Actor

  ) => {

    const article = await articleRepository.findById(articleId)
    if (!article) throw AppError.notFound('Article not found')
    if (user.role !== 'ADMIN' && article.authorId !== user.id) {
      throw AppError.forbidden('You can only publish your own articles')
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
    user: Actor
  ) => {

    const article = await articleRepository.findById(articleId)
    if (!article) throw AppError.notFound('Article not found')
    if (user.role !== 'ADMIN' && article.authorId !== user.id) {
      throw AppError.forbidden('You can only unpublish your own articles')
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

    const article = await articleRepository.findById(articleId)
    if (!article) throw AppError.notFound('Article not found')

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
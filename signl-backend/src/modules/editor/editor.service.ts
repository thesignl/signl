import { editorRepository } from './editor.repository.js'
import {
  buildContentBlocks,
  buildAnalysisSteps,
  decodeContentBlocks,
  decodeAnalysisSteps,
} from './editor.mapper.js'
import type {
  CreateDraftInput,
  UpdateDraftInput,
} from './editor.validation.js'

type Actor = { id: string; name?: string; role: string }

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60)
}

/** Shape returned to the editor client — flattened + decoded for the UI. */
function serializeForEditor(article: any) {
  if (!article) return null
  const { meta, blocks, analysisBlocks } = decodeContentBlocks(
    article.blocks ?? [],
  )
  return {
    id: article.id,
    headline: article.title ?? '',
    deck: meta.deck,
    summary: article.summary ?? '',
    synopsis: article.summary ?? '',
    summaryPoints: meta.summaryPoints,
    depths: meta.depths,
    signal: article.signal ?? '',
    slug: article.slug ?? '',
    coverImage: article.coverImage ?? '',
    premium: article.premium,
    featured: article.featured,
    verified: article.verified,
    articleType: article.articleType,
    status: article.status,
    readTime: article.readTime,
    views: article.views,
    saves: article.analytics?.bookmarks ?? article._count?.bookmarks ?? 0,
    readThrough:
      article.analytics && article.analytics.totalViews > 0
        ? Math.round(
            (article.analytics.avgReadTime / (article.readTime || 1)) * 100,
          )
        : article.analytics?.bounceRate
          ? Math.max(0, Math.round(100 - article.analytics.bounceRate))
          : 0,
    publishAt: article.publishedAt
      ? new Date(article.publishedAt).toISOString()
      : '',
    seoTitle: article.seoTitle ?? '',
    seoDescription: article.seoDescription ?? '',
    seoKeywords: article.seoKeywords ?? '',
    categoryId: article.categoryId,
    authorId: article.authorId,
    category: article.category ?? null,
    author: article.author ?? null,
    tags: (article.tags ?? []).map((t: any) => t.tag?.name).filter(Boolean),
    blocks,
    analysisBlocks,
    analysisSteps: decodeAnalysisSteps(article.analysisSteps ?? []),
    updatedAt: article.updatedAt,
    createdAt: article.createdAt,
  }
}

export const editorService = {
  createDraft: async (actor: Actor, data: CreateDraftInput) => {
    const authorId = await editorRepository.resolveAuthorId(
      data.authorId,
      actor.name ?? 'Signl Desk',
    )
    const categoryId = await editorRepository.resolveCategoryId(
      data.categoryId,
    )

    const title = data.headline ?? data.title ?? ''
    const summary = data.synopsis ?? data.summary ?? ''

    const article = await editorRepository.createDraft({
      title,
      summary,
      articleType: data.articleType ?? 'ARTICLE',
      status: 'DRAFT',
      authorId,
      categoryId,
      updatedById: actor.id,
      readTime: 1,
    })

    return serializeForEditor(article)
  },

  saveDraft: async (id: string, actor: Actor, data: UpdateDraftInput) => {
    const existing = await editorRepository.findById(id)
    if (!existing) throw new Error('Draft not found')
    assertOwnership(existing, actor)

    const title = data.headline ?? data.title
    const summary = data.synopsis ?? data.summary

    const scalar: Record<string, unknown> = {
      updatedById: actor.id,
    }
    if (title !== undefined) scalar.title = title
    if (summary !== undefined) scalar.summary = summary
    if (data.signal !== undefined) scalar.signal = data.signal
    if (data.coverImage !== undefined) scalar.coverImage = data.coverImage
    if (data.premium !== undefined) scalar.premium = data.premium
    if (data.featured !== undefined) scalar.featured = data.featured
    if (data.articleType !== undefined) scalar.articleType = data.articleType
    if (data.status !== undefined) scalar.status = data.status
    if (data.readTime !== undefined && data.readTime > 0)
      scalar.readTime = data.readTime
    if (data.seoTitle !== undefined) scalar.seoTitle = data.seoTitle
    if (data.seoDescription !== undefined)
      scalar.seoDescription = data.seoDescription
    if (data.seoKeywords !== undefined) scalar.seoKeywords = data.seoKeywords
    if (data.publishAt !== undefined)
      scalar.publishedAt = data.publishAt ? new Date(data.publishAt) : null

    // slug: explicit value wins; otherwise derive from headline when present.
    if (data.slug !== undefined && data.slug !== null && data.slug !== '') {
      scalar.slug = data.slug
    } else if (title) {
      scalar.slug = slugify(title)
    }

    if (data.categoryId) {
      scalar.categoryId = await editorRepository.resolveCategoryId(
        data.categoryId,
      )
    }
    if (data.authorId) {
      scalar.authorId = await editorRepository.resolveAuthorId(
        data.authorId,
        actor.name ?? 'Signl Desk',
      )
    }

    // Relations — only rebuilt when the client sent the relevant arrays.
    const touchesContent =
      data.blocks !== undefined ||
      data.analysisBlocks !== undefined ||
      data.deck !== undefined ||
      data.summaryPoints !== undefined ||
      data.depths !== undefined

    const blocks = touchesContent
      ? buildContentBlocks({
          deck: data.deck,
          summaryPoints: data.summaryPoints,
          depths: data.depths,
          blocks: data.blocks as any,
          analysisBlocks: data.analysisBlocks as any,
        })
      : undefined

    const analysisSteps =
      data.analysisSteps !== undefined
        ? buildAnalysisSteps(data.analysisSteps)
        : undefined

    const tagIds =
      data.tags !== undefined
        ? await editorRepository.resolveTagIds(data.tags)
        : undefined

    const saved = await editorRepository.saveArticle(id, scalar, {
      blocks,
      analysisSteps,
      tagIds,
    })

    return serializeForEditor(saved)
  },

  publish: async (id: string, actor: Actor) => {
    const existing = await editorRepository.findById(id)
    if (!existing) throw new Error('Draft not found')
    assertOwnership(existing, actor)

    const verified = actor.role === 'ADMIN'
    const publishedAt =
      existing.publishedAt && existing.publishedAt > new Date()
        ? existing.publishedAt // respect a future schedule
        : new Date()

    const saved = await editorRepository.saveArticle(
      id,
      {
        status: 'PUBLISHED',
        verified,
        publishedAt,
        updatedById: actor.id,
      },
      {},
    )
    return serializeForEditor(saved)
  },

  submitForReview: async (id: string, actor: Actor) => {
    const existing = await editorRepository.findById(id)
    if (!existing) throw new Error('Draft not found')
    assertOwnership(existing, actor)

    const saved = await editorRepository.saveArticle(
      id,
      { status: 'REVIEW', updatedById: actor.id },
      {},
    )
    return serializeForEditor(saved)
  },

  getDrafts: async (actor: Actor) => {
    const list = await editorRepository.listByEditor(actor.id)
    return list.map(serializeForEditor)
  },

  getEditorArticle: async (id: string, actor: Actor) => {
    const article = await editorRepository.findById(id)
    if (!article) throw new Error('Article not found')
    assertOwnership(article, actor)
    return serializeForEditor(article)
  },

  getCategories: async () => editorRepository.listCategories(),
  getAuthors: async () => editorRepository.listAuthors(),
}

/**
 * An article belongs to the editor who created/last-touched it. ADMINs may edit
 * anything. If no editor has been recorded yet (legacy rows), allow access.
 */
function assertOwnership(article: { updatedById: string | null }, actor: Actor) {
  if (actor.role === 'ADMIN') return
  if (!article.updatedById) return
  if (article.updatedById !== actor.id) {
    throw new Error('Unauthorized')
  }
}

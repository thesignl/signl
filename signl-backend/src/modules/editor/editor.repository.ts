import { Prisma } from '@prisma/client'
import prisma from '../../infrastructure/prisma/client.js'

/**
 * Editor repository — all persistence for the editorial workspace.
 *
 * Ownership note: `Article.authorId` is a FK to `User` via the "ArticleAuthor"
 * relation. We track "who is editing" via `Article.updatedById` (FK → User).
 * The Author model was removed in migration 20260615125528_merge_editor_author.
 */

const editorInclude = {
  blocks: { orderBy: { position: 'asc' } },
  analysisSteps: { orderBy: { stepNumber: 'asc' } },
  tags: { include: { tag: true } },
  category: true,
  author: true,
  analytics: true,
  _count: { select: { bookmarks: true } },
} satisfies Prisma.ArticleInclude

export const editorRepository = {
  resolveAuthorId: async (
    preferredAuthorId: string | undefined,
    _fallbackName: string,
  ): Promise<string> => {
    if (preferredAuthorId) {
      const found = await prisma.user.findUnique({ where: { id: preferredAuthorId } })
      if (found) return found.id
    }
    const editor = await prisma.user.findFirst({
      where: { role: 'EDITOR' },
      orderBy: { createdAt: 'asc' },
    })
    if (editor) return editor.id
    const anyUser = await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } })
    if (anyUser) return anyUser.id
    throw new Error('No users found to assign as article author')
  },

  /** Ensure there is at least one Category and return its id. */
  resolveCategoryId: async (
    preferredCategoryId: string | undefined,
  ): Promise<string> => {
    if (preferredCategoryId) {
      const found = await prisma.category.findUnique({
        where: { id: preferredCategoryId },
      })
      if (found) return found.id
    }
    const existing = await prisma.category.findFirst({
      orderBy: { createdAt: 'asc' },
    })
    if (existing) return existing.id
    const created = await prisma.category.create({
      data: { name: 'Uncategorised', slug: 'uncategorised' },
    })
    return created.id
  },

  createDraft: async (data: Prisma.ArticleUncheckedCreateInput) => {
    return prisma.article.create({ data, include: editorInclude })
  },

  findById: async (id: string) => {
    return prisma.article.findUnique({
      where: { id },
      include: editorInclude,
    })
  },

  /**
   * Persist an article and replace its blocks / analysis steps / tags inside a
   * single transaction. Relations are diffed by full replace — simple, correct,
   * and cheap for the modest block counts an editorial piece carries.
   */
  saveArticle: async (
    id: string,
    scalar: Prisma.ArticleUncheckedUpdateInput,
    relations: {
      blocks?: { type: any; content: unknown; position: number }[]
      analysisSteps?: {
        title: string
        description: string
        stepNumber: number
      }[]
      tagIds?: string[] | null
    },
  ) => {
    return prisma.$transaction(async (tx) => {
      await tx.article.update({ where: { id }, data: scalar })

      if (relations.blocks) {
        await tx.contentBlock.deleteMany({ where: { articleId: id } })
        if (relations.blocks.length > 0) {
          await tx.contentBlock.createMany({
            data: relations.blocks.map((b) => ({
              articleId: id,
              type: b.type,
              content: b.content as Prisma.InputJsonValue,
              position: b.position,
            })),
          })
        }
      }

      if (relations.analysisSteps) {
        await tx.analysisStep.deleteMany({ where: { articleId: id } })
        if (relations.analysisSteps.length > 0) {
          await tx.analysisStep.createMany({
            data: relations.analysisSteps.map((s) => ({
              articleId: id,
              title: s.title,
              description: s.description,
              stepNumber: s.stepNumber,
            })),
          })
        }
      }

      if (relations.tagIds) {
        await tx.articleTag.deleteMany({ where: { articleId: id } })
        if (relations.tagIds.length > 0) {
          await tx.articleTag.createMany({
            data: relations.tagIds.map((tagId) => ({
              articleId: id,
              tagId,
            })),
            skipDuplicates: true,
          })
        }
      }

      return tx.article.findUnique({
        where: { id },
        include: editorInclude,
      })
    })
  },

  /**
   * Resolve tag names → tag ids, creating any that don't exist yet.
   */
  resolveTagIds: async (names: string[]): Promise<string[]> => {
    const clean = Array.from(
      new Set(names.map((n) => n.trim()).filter(Boolean)),
    )
    const ids: string[] = []
    for (const name of clean) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
      const tag = await prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name, slug },
      })
      ids.push(tag.id)
    }
    return ids
  },

  /** All articles authored by this editor, newest first, across every status. */
  listByEditor: async (userId: string) => {
    return prisma.article.findMany({
      where: { authorId: userId, deletedAt: null },
      orderBy: { updatedAt: 'desc' },
      include: editorInclude,
    })
  },

  listCategories: async () => prisma.category.findMany({ orderBy: { name: 'asc' } }),
  listAuthors: async () => prisma.user.findMany({
    where: { role: 'EDITOR' },
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  }),
}

import { z } from 'zod'

// ── Articles ──────────────────────────────────────────────────

export const listArticlesQuerySchema = z.object({
  status: z
    .enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'])
    .optional(),
  categoryId: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export const changeArticleStatusSchema = z.object({
  status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']),
})

export const bulkArticleActionSchema = z.object({
  ids: z.array(z.string()).min(1).max(100),
  action: z.enum(['publish', 'archive', 'delete']),
})

// ── Authors ───────────────────────────────────────────────────

export const updateAuthorSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only')
    .optional(),
  title: z.string().optional(),
  bio: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  avatar: z.string().url().optional().or(z.literal('')),
})

// ── Categories ────────────────────────────────────────────────

export const createCategorySchema = z.object({
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  short: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+$/, 'Short must be lowercase alphanumeric'),
  color: z.string().optional(),
  description: z.string().optional(),
  displayOrder: z.number().int().default(0),
})

export const updateCategorySchema = createCategorySchema.partial()

// ── Tags ──────────────────────────────────────────────────────

export const createTagSchema = z.object({
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
})

export const updateTagSchema = createTagSchema.partial()

// ── Inferred types ────────────────────────────────────────────

export type ListArticlesQuery = z.infer<typeof listArticlesQuerySchema>
export type ChangeArticleStatusInput = z.infer<typeof changeArticleStatusSchema>
export type BulkArticleActionInput = z.infer<typeof bulkArticleActionSchema>
export type UpdateAuthorInput = z.infer<typeof updateAuthorSchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
export type CreateTagInput = z.infer<typeof createTagSchema>
export type UpdateTagInput = z.infer<typeof updateTagSchema>

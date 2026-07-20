import { z } from 'zod'

/**
 * Editor draft validation.
 *
 * The editor is intentionally permissive on create — a brand-new draft may have
 * an empty headline/summary (the reference editor lets writers start from a
 * blank canvas). All scalar `Article` columns the schema requires are filled
 * with safe defaults inside the service, so the client only needs to send what
 * the writer has actually typed so far.
 */

const blockTypeEnum = z.enum([
  'paragraph',
  'heading',
  'quote',
  'datatable',
])

const editorBlockSchema = z.object({
  id: z.string().optional(),
  type: blockTypeEnum,
  surface: z.enum(['article', 'analysis']).optional(),
  content: z.string().optional().default(''),
  cite: z.string().optional(),
  // datatable payload
  cols: z.number().int().positive().max(12).optional(),
  rows: z.number().int().positive().max(50).optional(),
  data: z.array(z.array(z.string())).optional(),
})

const analysisStepSchema = z.object({
  id: z.string().optional(),
  num: z.string().optional(),
  label: z.string().optional().default(''),
  text: z.string().optional().default(''),
})

/** Statuses the editor is allowed to set directly (no SCHEDULED enum exists). */
const editableStatusEnum = z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'])

export const createDraftSchema = z.object({
  title: z.string().max(300).optional(),
  headline: z.string().max(300).optional(),
  summary: z.string().optional(),
  synopsis: z.string().optional(),
  // Universal editor fields (post-refactor). All optional — legacy callers
  // that don't send these are unaffected.
  subheading: z.string().max(500).optional(),
  contentHtml: z.string().optional(),
  contentJson: z.unknown().optional(),
  articleType: z
    .enum(['ARTICLE', 'ANALYSIS', 'BRIEF', 'LEARN'])
    .optional(),
  categoryId: z.string().optional(),
  authorId: z.string().optional(),
})

export const updateDraftSchema = z.object({
  // scalar fields
  title: z.string().max(300).optional(),
  headline: z.string().max(300).optional(),
  summary: z.string().optional(),
  synopsis: z.string().optional(),
  // Universal editor fields (post-refactor). All optional.
  subheading: z.string().max(500).optional().nullable(),
  contentHtml: z.string().optional().nullable(),
  contentJson: z.unknown().optional(),
  deck: z.string().optional(),
  signal: z.string().optional(),
  slug: z.string().max(120).optional().nullable(),
  coverImage: z.string().optional().nullable(),
  premium: z.boolean().optional(),
  featured: z.boolean().optional(),
  articleType: z.enum(['ARTICLE', 'ANALYSIS', 'BRIEF', 'LEARN']).optional(),
  status: editableStatusEnum.optional(),
  readTime: z.number().int().min(0).max(180).optional(),
  publishAt: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  seoKeywords: z.string().optional().nullable(),
  categoryId: z.string().optional(),
  authorId: z.string().optional(),

  // composition / relations
  depths: z.array(z.enum(['summary', 'article', 'analysis'])).optional(),
  summaryPoints: z.array(z.string()).optional(),
  blocks: z.array(editorBlockSchema).optional(),
  analysisBlocks: z.array(editorBlockSchema).optional(),
  analysisSteps: z.array(analysisStepSchema).optional(),
  tags: z.array(z.string()).optional(),
})

export type CreateDraftInput = z.infer<typeof createDraftSchema>
export type UpdateDraftInput = z.infer<typeof updateDraftSchema>
export type EditorBlockInput = z.infer<typeof editorBlockSchema>
export type AnalysisStepInput = z.infer<typeof analysisStepSchema>

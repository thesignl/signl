import { z } from 'zod'

export const createArticleSchema = z.object({

  title:
    z.string().min(5),

  slug:
    z.string(),

  summary:
    z.string(),

  content:
    z.any().optional(),

  contentText:
    z.string().optional(),

  signal:
    z.string().optional(),

  coverImage:
    z.string().optional(),

  premium:
    z.boolean().default(false),

  featured:
    z.boolean().default(false),

  articleType:
    z.enum([
      'ARTICLE',
      'ANALYSIS',
      'BRIEF',
      'LEARN'
    ]),

  readTime:
    z.number(),

  seoTitle:
    z.string().optional(),

  seoDescription:
    z.string().optional(),

  seoKeywords:
    z.string().optional(),

  canonicalUrl:
    z.string().optional(),

  // ADMIN may attribute an article to a specific editor; EDITOR value is ignored (forced to req.user.id)
  authorId:
    z.string().optional(),

  categoryId:
    z.string()
})

// Explicit allowlist — fields not listed here cannot be set via PATCH /articles/:id
export const updateArticleSchema = z.object({
  title:        z.string().min(5).optional(),
  slug:         z.string().optional(),
  summary:      z.string().optional(),
  contentText:  z.string().optional(),
  signal:       z.string().optional(),
  coverImage:   z.string().optional(),
  premium:      z.boolean().optional(),
  featured:     z.boolean().optional(),
  articleType:  z.enum(['ARTICLE', 'ANALYSIS', 'BRIEF', 'LEARN']).optional(),
  readTime:     z.number().positive().optional(),
  seoTitle:     z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords:  z.string().optional(),
  canonicalUrl: z.string().optional(),
  categoryId:   z.string().optional(),
})

export type CreateArticleInput =
  z.infer<typeof createArticleSchema>

export type UpdateArticleInput =
  z.infer<typeof updateArticleSchema>
import { z } from 'zod'

export const createArticleSchema = z.object({

  title:
    z.string().min(5),

  slug:
    z.string(),

  summary:
    z.string(),

  content:
    z.any(),

  contentText:
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

  status:
    z.enum([
      'DRAFT',
      'REVIEW',
      'PUBLISHED',
      'ARCHIVED'
    ])
    .default('DRAFT'),

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

  authorId:
    z.string(),

  categoryId:
    z.string()
})

export type CreateArticleInput =
  z.infer<
    typeof createArticleSchema
  >
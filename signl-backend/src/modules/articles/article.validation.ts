import { z } from 'zod'

export const createArticleSchema = z.object({

  title: z.string().min(5),

  slug: z.string().min(5),

  summary: z.string().min(20),

  content: z.any(),

  coverImage: z.string().optional(),

  premium: z.boolean(),

  articleType: z.enum([
    'ARTICLE',
    'ANALYSIS',
    'BRIEF',
    'LEARN'
  ]),

  published: z.boolean(),

  readTime: z.number(),

  authorId: z.string(),

  categoryId: z.string()
})
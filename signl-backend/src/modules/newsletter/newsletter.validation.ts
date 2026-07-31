import { z } from 'zod'

export const subscribeSchema = z.object({
  email: z.string().email().max(254),
  name: z.string().max(120).optional(),
  source: z.string().max(60).optional(),
})

export const tokenSchema = z.object({
  token: z.string().min(10).max(200),
})

export const updatePreferencesSchema = z.object({
  token: z.string().min(10).max(200),
  preferences: z
    .array(
      z.object({
        categoryId: z.string().min(1),
        subscribed: z.boolean(),
      }),
    )
    .max(50),
})

export type SubscribeInput = z.infer<typeof subscribeSchema>
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>

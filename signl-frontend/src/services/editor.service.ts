import api from '@/lib/axios'
import type {
  EditorArticle,
  EditorAuthor,
  EditorCategory,
} from '@/types/editor'

/**
 * Editor API client. Thin, typed wrappers over the `/api/editor` routes. The
 * axios interceptor attaches the JWT, so these stay token-agnostic.
 */

interface CreateDraftPayload {
  headline?: string
  summary?: string
  synopsis?: string
  articleType?: string
  categoryId?: string
  authorId?: string
}

export async function createDraft(
  payload: CreateDraftPayload,
): Promise<EditorArticle> {
  const res = await api.post('/editor/draft', payload)
  return res.data.data
}

export async function updateDraft(
  id: string,
  payload: Record<string, unknown>,
): Promise<EditorArticle> {
  const res = await api.patch(`/editor/draft/${id}`, payload)
  return res.data.data
}

export async function publishDraft(id: string): Promise<EditorArticle> {
  const res = await api.patch(`/editor/publish/${id}`)
  return res.data.data
}

export async function submitForReview(id: string): Promise<EditorArticle> {
  const res = await api.patch(`/editor/review/${id}`)
  return res.data.data
}

export async function getDraft(id: string): Promise<EditorArticle> {
  const res = await api.get(`/editor/${id}`)
  return res.data.data
}

export async function listDrafts(): Promise<EditorArticle[]> {
  const res = await api.get('/editor/drafts')
  return res.data.data
}

export async function listCategories(): Promise<EditorCategory[]> {
  const res = await api.get('/editor/categories')
  return res.data.data
}

export async function listAuthors(): Promise<EditorAuthor[]> {
  const res = await api.get('/editor/authors')
  return res.data.data
}

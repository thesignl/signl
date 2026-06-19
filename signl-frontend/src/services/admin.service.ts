import api from '@/lib/axios'
import type { DashboardStats } from '@/types/admin'

// ── Dashboard ───────────────────────────────────────────────────
export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await api.get('/admin/dashboard')
  return res.data.data
}

// ── Users ───────────────────────────────────────────────────────
export const getUsers = async () => (await api.get('/admin/users')).data.data
export const updateRole = async (id: string, role: string) =>
  api.patch(`/admin/users/${id}/role`, { role })
export const deleteUser = async (id: string) => api.delete(`/admin/users/${id}`)

// ── Categories ──────────────────────────────────────────────────
export const getCategories = async () =>
  (await api.get('/admin/categories')).data.data
export const createCategory = async (data: { name: string; slug?: string; short?: string; color?: string; description?: string }) =>
  (await api.post('/admin/categories', data)).data.data
export const updateCategory = async (id: string, data: Record<string, unknown>) =>
  (await api.patch(`/admin/categories/${id}`, data)).data.data
export const deleteCategory = async (id: string) =>
  api.delete(`/admin/categories/${id}`)
export const toggleCategoryActive = async (id: string) =>
  (await api.patch(`/admin/categories/${id}/toggle`)).data.data

// ── Tags ────────────────────────────────────────────────────────
export const getTags = async () => (await api.get('/admin/tags')).data.data
export const createTag = async (data: { name: string; slug?: string }) =>
  (await api.post('/admin/tags', data)).data.data
export const updateTag = async (id: string, data: { name?: string; slug?: string }) =>
  (await api.patch(`/admin/tags/${id}`, data)).data.data
export const deleteTag = async (id: string) => api.delete(`/admin/tags/${id}`)

// ── Articles ────────────────────────────────────────────────────
export const getArticles = async (params?: Record<string, unknown>) =>
  (await api.get('/admin/articles', { params })).data.data
export const getArticleById = async (id: string) =>
  (await api.get(`/admin/articles/${id}`)).data.data
export const changeArticleStatus = async (id: string, status: string) =>
  (await api.patch(`/admin/articles/${id}/status`, { status })).data.data
export const bulkArticleAction = async (ids: string[], action: string) =>
  (await api.post('/admin/articles/bulk', { ids, action })).data.data

// ── Authors (Editors) ───────────────────────────────────────────
export const getAuthors = async () =>
  (await api.get('/admin/authors')).data.data
export const getAuthor = async (id: string) =>
  (await api.get(`/admin/authors/${id}`)).data.data
export const updateAuthor = async (id: string, data: Record<string, unknown>) =>
  (await api.patch(`/admin/authors/${id}`, data)).data.data

// ── Placements ──────────────────────────────────────────────────
export const getPlacements = async () =>
  (await api.get('/admin/placements')).data.data
export const createPlacement = async (data: { articleId: string; section: string; priority?: number }) =>
  (await api.post('/admin/placements', data)).data.data
export const updatePlacement = async (id: string, data: Record<string, unknown>) =>
  (await api.patch(`/admin/placements/${id}`, data)).data.data
export const deletePlacement = async (id: string) =>
  api.delete(`/admin/placements/${id}`)

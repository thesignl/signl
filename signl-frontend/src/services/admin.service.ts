import api from '@/lib/axios'
import type {
  DashboardStats,
  ArticleListResponse,
  AdminCategory,
  AdminUser,
  AdminSubscriber,
  SubscriberListResponse,
  AnalyticsOverview,
  ViewsDataPoint,
  AdminPlacement,
} from '@/types/admin'

// ── Dashboard ───────────────────────────────────────────────────
export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await api.get('/admin/dashboard')
  return res.data.data
}

export async function getUsers(): Promise<AdminUser[]> {
  const response = await api.get('/admin/users')
  return response.data.data
}

export const updateRole =
async (

 id: string,

 role: string

) => {

 return api.patch(

  `/admin/users/${id}/role`,

  { role }
 )
}

export const deleteUser =
async (
 id: string
) => {

 return api.delete(

  `/admin/users/${id}`
 )
}

export async function getArticles(params?: {
  status?: string
  categoryId?: string
  search?: string
  page?: number
  limit?: number
}): Promise<ArticleListResponse> {
  const q = new URLSearchParams()
  if (params?.status) q.set('status', params.status)
  if (params?.categoryId) q.set('categoryId', params.categoryId)
  if (params?.search) q.set('search', params.search)
  if (params?.page) q.set('page', String(params.page))
  if (params?.limit) q.set('limit', String(params.limit))
  const qs = q.toString()
  const response = await api.get(`/admin/articles${qs ? '?' + qs : ''}`)
  return response.data.data
}

export async function changeArticleStatus(
  id: string,
  status: string,
): Promise<void> {
  await api.patch(`/admin/articles/${id}/status`, { status })
}

export async function bulkArticleAction(
  ids: string[],
  action: 'publish' | 'archive' | 'delete',
): Promise<{ affected: number }> {
  const response = await api.post('/admin/articles/bulk', { ids, action })
  return response.data.data
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const response = await api.get('/admin/categories')
  return response.data.data
}

export async function getAdminAuthors(): Promise<import('@/types/admin').AdminAuthor[]> {
  const response = await api.get('/admin/authors')
  return response.data.data
}

export async function getAdminAuthor(id: string): Promise<import('@/types/admin').AdminAuthor> {
  const response = await api.get(`/admin/authors/${id}`)
  return response.data.data
}

export async function updateAdminAuthor(
  id: string,
  data: Partial<{ name: string; title: string; bio: string; twitter: string; linkedin: string; slug: string }>,
): Promise<void> {
  await api.patch(`/admin/authors/${id}`, data)
}

export async function createAdminCategory(data: {
  name: string
  slug?: string
  short?: string
  color?: string
  description?: string
  displayOrder?: number
}): Promise<AdminCategory> {
  const response = await api.post('/admin/categories', data)
  return response.data.data
}

export async function updateAdminCategory(
  id: string,
  data: Partial<{ name: string; slug: string; short: string; color: string; description: string; displayOrder: number }>,
): Promise<AdminCategory> {
  const response = await api.patch(`/admin/categories/${id}`, data)
  return response.data.data
}

export async function toggleAdminCategory(id: string): Promise<AdminCategory> {
  const response = await api.patch(`/admin/categories/${id}/toggle`)
  return response.data.data
}

export async function deleteAdminCategory(id: string): Promise<void> {
  await api.delete(`/admin/categories/${id}`)
}

export async function getAdminTags(): Promise<import('@/types/admin').AdminTag[]> {
  const response = await api.get('/admin/tags')
  return response.data.data
}

export async function createAdminTag(data: { name: string; slug?: string }): Promise<import('@/types/admin').AdminTag> {
  const response = await api.post('/admin/tags', data)
  return response.data.data
}

export async function updateAdminTag(
  id: string,
  data: { name: string; slug?: string },
): Promise<import('@/types/admin').AdminTag> {
  const response = await api.patch(`/admin/tags/${id}`, data)
  return response.data.data
}

export async function deleteAdminTag(id: string): Promise<void> {
  await api.delete(`/admin/tags/${id}`)
}

export async function getAdminSubscribers(params?: {
  search?: string
  page?: number
  limit?: number
}): Promise<SubscriberListResponse> {
  const q = new URLSearchParams()
  if (params?.search) q.set('search', params.search)
  if (params?.page) q.set('page', String(params.page))
  if (params?.limit) q.set('limit', String(params.limit))
  const qs = q.toString()
  const response = await api.get(`/admin/subscribers${qs ? '?' + qs : ''}`)
  return response.data.data
}

export async function exportAdminSubscribers(): Promise<AdminSubscriber[]> {
  const response = await api.get('/admin/subscribers/export')
  return response.data.data
}

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  const response = await api.get('/admin/analytics/overview')
  return response.data.data
}

export async function getAnalyticsViews(days: number = 30): Promise<ViewsDataPoint[]> {
  const response = await api.get(`/admin/analytics/views?days=${days}`)
  return response.data.data
}

export async function getAdminPlacements(): Promise<AdminPlacement[]> {
  const response = await api.get('/admin/placement')
  return response.data.data
}

export async function createAdminPlacement(data: {
  articleId: string
  section: string
  priority?: number
}): Promise<AdminPlacement> {
  const response = await api.post('/admin/placement', data)
  return response.data.data
}

export async function updateAdminPlacement(
  id: string,
  data: { priority?: number; active?: boolean },
): Promise<AdminPlacement> {
  const response = await api.patch(`/admin/placement/${id}`, data)
  return response.data.data
}

export async function deleteAdminPlacement(id: string): Promise<void> {
  await api.delete(`/admin/placement/${id}`)
}
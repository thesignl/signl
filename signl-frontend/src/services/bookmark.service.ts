import api from '@/lib/axios'
import type { Bookmark } from '@/types/bookmark'

// The axios interceptor in src/lib/axios.ts attaches the JWT
// automatically. The legacy `token` parameters are kept for
// backwards compatibility with existing call sites but no longer
// have any effect on the request itself.

export const saveBookmark = async (articleId: string, _token?: string) => {
  void _token
  return api.post('/bookmarks', { articleId })
}

export const removeBookmark = async (articleId: string, _token?: string) => {
  void _token
  return api.delete(`/bookmarks/${articleId}`)
}

export const getBookmarks = async (_token?: string): Promise<Bookmark[]> => {
  void _token
  const response = await api.get('/bookmarks')
  return response.data?.data ?? []
}

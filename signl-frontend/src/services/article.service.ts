import api from '@/lib/axios'
import type { Article } from '@/types/article'

export const getFeed = async (): Promise<Article[]> => {
  const response = await api.get('/articles')
  return response.data.data
}

export const getArticle = async (slug: string): Promise<Article | null> => {
  const response = await api.get(`/articles/${slug}`)
  return response.data.data
}

export const searchArticles = async (query: string): Promise<Article[]> => {
  const response = await api.get(`/articles/search?q=${query}`)
  return response.data.data
}

export const getAnalysisFeed = async (): Promise<Article[]> => {
  const response = await api.get('/articles/analysis/feed')
  return response.data.data
}

export const getBriefArticles = async (): Promise<Article[]> => {
  const response = await api.get('/articles/briefs')
  return response.data.data
}

export const getAnalysisArticles = async (): Promise<Article[]> => {
  const response = await api.get('/articles/analysis')
  return response.data.data
}

export const getFeaturedArticle = async (): Promise<Article | null> => {
  const response = await api.get('/articles/featured')
  return response.data.data[0] ?? null
}

export const getLearnFeed = async (): Promise<Article[]> => {
  const response = await api.get('/articles/learn/feed')
  return response.data.data
}

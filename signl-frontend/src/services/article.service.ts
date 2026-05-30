import api from '@/lib/axios'

export const getFeed =
async () => {

  const response =
    await api.get('/articles')

  return response.data.data
}

export const getArticle =
async (
  slug: string
) => {

  const response =
    await api.get(

      `/articles/${slug}`
    )

  return response.data.data
}

export const searchArticles =
async (
  query: string
) => {

  const response =
    await api.get(

      `/articles/search?q=${query}`
    )

  return response.data.data
}

export const getAnalysisFeed =
  async () => {

    const response =
      await api.get(
        '/articles/analysis/feed'
      )

    return response.data.data
  }

  export const getBriefArticles =
async () => {

  const response =
    await api.get(
      '/articles/briefs'
    )

  return response.data.data
}

export const getAnalysisArticles =
async () => {

  const response =
    await api.get(
      '/articles/analysis'
    )

  return response.data.data
}

export const getFeaturedArticle =
async () => {

  const response =
    await api.get(
      '/articles/featured'
    )

  return response.data.data[0]
}

export const getLearnFeed =
  async () => {

    const response =
      await api.get(
        '/articles/learn/feed'
      )

    return response.data.data
  }
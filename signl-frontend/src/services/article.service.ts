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
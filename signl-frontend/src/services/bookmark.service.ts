import api from '@/lib/axios'

export const saveBookmark =
async (

  articleId: string,

  token: string

) => {

  return api.post(

    '/bookmarks',

    {
      articleId
    },

    {
      headers: {

        Authorization:
          `Bearer ${token}`
      }
    }
  )
}

export const removeBookmark =
async (

  articleId: string,

  token: string

) => {

  return api.delete(

    `/bookmarks/${articleId}`,

    {
      headers: {

        Authorization:
          `Bearer ${token}`
      }
    }
  )
}


export const getBookmarks =
async (
  token: string
) => {

  const response =
    await api.get(

      '/bookmarks',

      {
        headers: {

          Authorization:
            `Bearer ${token}`
        }
      }
    )

  return response.data.data
}
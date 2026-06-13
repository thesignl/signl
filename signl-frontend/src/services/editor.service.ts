import api from '@/lib/axios'

export const createDraft =
async (payload: any) => {

  const response =
    await api.post(
      '/editor/draft',
      payload
    )

  return response.data.data
}

export const updateDraft =
async (

  id: string,

  payload: any

) => {

  const response =
    await api.patch(

      `/editor/draft/${id}`,

      payload
    )

  return response.data.data
}

export const publishDraft =
async (

  id: string

) => {

  const response =
    await api.patch(

      `/editor/publish/${id}`
    )

  return response.data.data
}

export const getDraft =
async (

  id: string

) => {

  const response =
    await api.get(
      `/editor/${id}`
    )

  return response.data.data
}
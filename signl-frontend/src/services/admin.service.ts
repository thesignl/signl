import api
from '@/lib/axios'

export const getDashboardStats =
async () => {

  const response =
    await api.get(
      '/admin/dashboard'
    )

  return response.data.data
}

export const getUsers =
async () => {

 const response =
  await api.get(
   '/admin/users'
  )

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

export const getAuthors =
  async () => {

  const response =
    await api.get(
    '/admin/authors'
    )

  return response.data.data
}

export const createAuthor =
  async (
  payload: any
  ) => {

  return api.post(

    '/admin/authors',

    payload
  )
}

export const updateAuthor =
  async (

    id: string,

    payload: any

    ) => {

    return api.patch(

      `/admin/authors/${id}`,

      payload
    )
  }

  export const deleteAuthor =
    async (
    id: string
    ) => {

    return api.delete(

      `/admin/authors/${id}`
    )
  }
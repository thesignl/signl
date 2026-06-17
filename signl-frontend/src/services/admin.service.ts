import api from '@/lib/axios'
import type { DashboardStats } from '@/types/admin'

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await api.get('/admin/dashboard')
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
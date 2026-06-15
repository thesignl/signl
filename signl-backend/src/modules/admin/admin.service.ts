import {
  adminRepository
}
from './admin.repository.js'

export const adminService = {

  getDashboardStats:
  async () => {

    return adminRepository
      .getStats()
  },
  getUsers:
  async () => {

    return adminRepository
      .getUsers()
  },
  updateRole:
  async (

    id: string,

    role: string

  ) => {

    return adminRepository
      .updateUserRole(
        id,
        role
      )
  },

  deleteUser:
  async (
    id: string
  ) => {

    return adminRepository
      .deleteUser(id)
  },

  getAuthors:
  async () => {

    return adminRepository
      .getAuthors()
  },

  createAuthor:
  async (
  data: any
  ) => {

  return adminRepository
    .createAuthor(data)
  },

  updateAuthor:
  async (

  id: string,

  data: any

  ) => {

  return adminRepository
    .updateAuthor(
    id,
    data
    )
  },

  deleteAuthor:
  async (
  id: string
  ) => {

  return adminRepository
    .deleteAuthor(id)
  },
}
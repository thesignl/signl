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

}
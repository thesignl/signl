import {
Request,
Response,
NextFunction
} from 'express'

import {
adminService
} from './admin.service.js'

import {
errorHandler
} from '../../shared/errors/errorHandler.js'

export const adminController = {

dashboard: async (
req: Request,
res: Response,
next: NextFunction
) => {


try {

  const stats =
    await adminService.getDashboardStats()

  return res.status(200).json({
    success: true,
    data: stats
  })

} catch (error) {

  return errorHandler(
    error,
    req,
    res,
    next
  )
}


},

users: async (
req: Request,
res: Response,
next: NextFunction
) => {


try {

  const users =
    await adminService.getUsers()

  return res.status(200).json({
    success: true,
    data: users
  })

} catch (error) {

  return errorHandler(
    error,
    req,
    res,
    next
  )
}


},

updateRole: async (
req: Request,
res: Response,
next: NextFunction
) => {


try {

  const user =
    await adminService.updateRole(
      req.params.id as string,
      req.body.role
    )

  return res.status(200).json({
    success: true,
    data: user
  })

} catch (error) {

  return errorHandler(
    error,
    req,
    res,
    next
  )
}


},

deleteUser: async (
  req: Request,
  res: Response,
  next: NextFunction
  ) => {


  try {

    await adminService.deleteUser(
      req.params.id as string
    )

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    })

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the user',
      error
    })
  }
  }
}

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

import {
  listArticlesQuerySchema,
  changeArticleStatusSchema,
  bulkArticleActionSchema,
  updateAuthorSchema,
  createCategorySchema,
  updateCategorySchema,
  createTagSchema,
  updateTagSchema,
} from './admin.validation.js'

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

    return errorHandler(error, req, res, next)
  }
  },

  // ── Articles ──────────────────────────────────────────────────

  listArticles: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const query = listArticlesQuerySchema.parse(req.query)
      const result = await adminService.listArticles(query)
      return res.status(200).json({ success: true, data: result })
    } catch (error) {
      return errorHandler(error, req, res, next)
    }
  },

  getArticleById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const article = await adminService.getArticleById(req.params.id as string)
      return res.status(200).json({ success: true, data: article })
    } catch (error) {
      return errorHandler(error, req, res, next)
    }
  },

  changeArticleStatus: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { status } = changeArticleStatusSchema.parse(req.body)
      const article = await adminService.changeArticleStatus(req.params.id as string, status)
      return res.status(200).json({ success: true, data: article })
    } catch (error) {
      return errorHandler(error, req, res, next)
    }
  },

  bulkArticleAction: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const input = bulkArticleActionSchema.parse(req.body)
      const result = await adminService.bulkArticleAction(input)
      return res.status(200).json({ success: true, data: result })
    } catch (error) {
      return errorHandler(error, req, res, next)
    }
  },

  // ── Authors / Editors ─────────────────────────────────────────

  listAuthors: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authors = await adminService.listAuthors()
      return res.status(200).json({ success: true, data: authors })
    } catch (error) {
      return errorHandler(error, req, res, next)
    }
  },

  getAuthor: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const author = await adminService.getAuthor(req.params.id as string)
      return res.status(200).json({ success: true, data: author })
    } catch (error) {
      return errorHandler(error, req, res, next)
    }
  },

  updateAuthor: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = updateAuthorSchema.parse(req.body)
      const author = await adminService.updateAuthor(req.params.id as string, data)
      return res.status(200).json({ success: true, data: author })
    } catch (error) {
      return errorHandler(error, req, res, next)
    }
  },

  // ── Categories ────────────────────────────────────────────────

  listCategories: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const categories = await adminService.listCategories()
      return res.status(200).json({ success: true, data: categories })
    } catch (error) {
      return errorHandler(error, req, res, next)
    }
  },

  createCategory: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = createCategorySchema.parse(req.body)
      const category = await adminService.createCategory(data)
      return res.status(201).json({ success: true, data: category })
    } catch (error) {
      return errorHandler(error, req, res, next)
    }
  },

  updateCategory: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = updateCategorySchema.parse(req.body)
      const category = await adminService.updateCategory(req.params.id as string, data)
      return res.status(200).json({ success: true, data: category })
    } catch (error) {
      return errorHandler(error, req, res, next)
    }
  },

  deleteCategory: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await adminService.deleteCategory(req.params.id as string)
      return res.status(200).json({ success: true, message: 'Category deleted' })
    } catch (error) {
      return errorHandler(error, req, res, next)
    }
  },

  toggleCategoryActive: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const category = await adminService.toggleCategoryActive(req.params.id as string)
      return res.status(200).json({ success: true, data: category })
    } catch (error) {
      return errorHandler(error, req, res, next)
    }
  },

  // ── Tags ──────────────────────────────────────────────────────

  listTags: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const tags = await adminService.listTags()
      return res.status(200).json({ success: true, data: tags })
    } catch (error) {
      return errorHandler(error, req, res, next)
    }
  },

  createTag: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = createTagSchema.parse(req.body)
      const tag = await adminService.createTag(data)
      return res.status(201).json({ success: true, data: tag })
    } catch (error) {
      return errorHandler(error, req, res, next)
    }
  },

  updateTag: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = updateTagSchema.parse(req.body)
      const tag = await adminService.updateTag(req.params.id as string, data)
      return res.status(200).json({ success: true, data: tag })
    } catch (error) {
      return errorHandler(error, req, res, next)
    }
  },

  deleteTag: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await adminService.deleteTag(req.params.id as string)
      return res.status(200).json({ success: true, message: 'Tag deleted' })
    } catch (error) {
      return errorHandler(error, req, res, next)
    }
  },

  // ── Placements ──────────────────────────────────────────────────

  listPlacements: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.listPlacements()
      return res.status(200).json({ success: true, data })
    } catch (error) { return errorHandler(error, req, res, next) }
  },

  createPlacement: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.createPlacement(req.body)
      return res.status(201).json({ success: true, data })
    } catch (error) { return errorHandler(error, req, res, next) }
  },

  updatePlacement: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await adminService.updatePlacement(req.params.id as string, req.body)
      return res.status(200).json({ success: true, data })
    } catch (error) { return errorHandler(error, req, res, next) }
  },

  deletePlacement: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await adminService.deletePlacement(req.params.id as string)
      return res.status(200).json({ success: true, message: 'Placement deleted' })
    } catch (error) { return errorHandler(error, req, res, next) }
  },
}

import { NextFunction, Request, Response }
from 'express'

import {
  editorService
}
from './editor.service.js'
import { editorRepository } from './editor.repository.js'

export const editorController = {

  createDraft: async (

    req: Request,

    res: Response

  ) => {

    try {

      const article =
        await editorService
          .createDraft(

            req.user.id,

            req.body
          )

      return res.status(201).json({

        success: true,

        data: article
      })

    } catch (error: any) {

      return res.status(500).json({

        success: false,

        message: error.message
      })
    }
  },

  updateDraft: async (

    req: Request,

    res: Response

  ) => {

    try {

      const article =
        await editorService
          .updateDraft(

            req.params.id as string,

            req.user.id,

            req.body
          )

      return res.json({

        success: true,

        data: article
      })

    } catch (error: any) {

      return res.status(500).json({

        success: false,

        message: error.message
      })
    }
  },

  publish: async (

    req: Request,

    res: Response

  ) => {

    try {

      const article =
        await editorService
          .publishArticle(

            req.params.id as string
          )

      return res.json({

        success: true,

        data: article
      })

    } catch (error: any) {

      return res.status(500).json({

        success: false,

        message: error.message
      })
    }
  },

  getDrafts: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const drafts =
        await editorService.getDrafts(
          req.user.id
        )

      res.status(200).json({
        success: true,
        data: drafts,
      })
    } catch (error) {
      next(error)
    }
  },

  getOne: async (
  req: Request,
  res: Response,
  next: NextFunction
  ) => {

  try {

    const article =
      await editorService
        .getEditorArticle(
          req.params.id as string,
          req.user.id
        )

    return res.json({
      success: true,
      data: article
    })

  } catch (error) {

    next(error)
  }
  }
}
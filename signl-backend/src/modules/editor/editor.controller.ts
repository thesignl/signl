import { Request, Response }
from 'express'

import {
  editorService
}
from './editor.service.js'

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

            req.params.id,

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

            req.params.id
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
  }
}
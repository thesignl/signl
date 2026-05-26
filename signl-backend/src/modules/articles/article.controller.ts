import { Request, Response } from 'express'

import { articleService }
from './article.service.js'

import {
  createArticleSchema
}
from './article.validation.js'
import { any } from 'zod'
import { AuthRequest } from '../auth/auth.middleware.js'

export const articleController = {

  create: async (
    req: Request,
    res: Response
  ) => {

    try {

      const validated =
        createArticleSchema.parse(
          req.body
        )

      const article =
        await articleService.createArticle(
          validated
        )

      return res.status(201).json({

        success: true,

        data: article
      })

    } catch (error: any) {

      return res.status(400).json({

        success: false,

        message: error.message
      })
    }
  },

  getFeed: async (
    _: Request,
    res: Response
  ) => {

    try {

      const articles =
        await articleService.getHomepageFeed()

      return res.json({

        success: true,

        data: articles
      })

    } catch (error: any) {

      return res.status(500).json({

        success: false,

        message: error.message
      })
    }
  },

  getBySlug: async (
    req: Request,
    res: Response
  ) => {

    try {

      const article =
        await articleService.getArticleBySlug(
          req.params.slug as string
        )

      return res.json({

        success: true,

        data: article
      })

    } catch (error: any) {

      return res.status(404).json({

        success: false,

        message: error.message
      })
    }
  },

  update: async (
    req: AuthRequest,
    res: Response
  ) => {

    try {

      const article =
        await articleService.updateArticle(

          req.params.id as string,

          req.body,

          req.user
        )

      return res.json({

        success: true,

        data: article
      })

    } catch (error: any) {

      return res.status(400).json({

        success: false,

        message: error.message
      })
    }
  },

  publish: async (
    req: AuthRequest,
    res: Response
  ) => {

    try {

      const article =
        await articleService.publishArticle(

          req.params.id as string,

          req.user
        )

      return res.json({

        success: true,

        data: article
      })

    } catch (error: any) {

      return res.status(400).json({

        success: false,

        message: error.message
      })
    }
  },

  unpublish: async (
    req: AuthRequest,
    res: Response
  ) => {

    try {

      const article =
        await articleService.unpublishArticle(

          req.params.id as string
        )

      return res.json({

        success: true,

        data: article
      })

    } catch (error: any) {

      return res.status(400).json({

        success: false,

        message: error.message
      })
    }
  },

  delete: async (
    req: AuthRequest,
    res: Response
  ) => {

    try {

      await articleService.deleteArticle(

        req.params.id as string
      )

      return res.json({

        success: true,

        message:
          'Article deleted'
      })

    } catch (error: any) {

      return res.status(400).json({

        success: false,

        message: error.message
      })
    }
  },

}
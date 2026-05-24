import { Request, Response } from 'express'

import { articleService }
from './article.service'

import {
  createArticleSchema
}
from './article.validation'
import { any } from 'zod'

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
  }
}
import prisma
from '../../infrastructure/prisma/client.js'

import { CreateArticleDTO }
from './article.types.js'

export const articleRepository = {

  create: async (
    data: CreateArticleDTO
  ) => {

    return prisma.article.create({

      data
    })
  },

  findAll: async () => {

    return prisma.article.findMany({

      where: {
        published: true
      },

      include: {

        author: true,

        category: true,

        tags: {
          include: {
            tag: true
          }
        }
      },

      orderBy: {
        createdAt: 'desc'
      }
    })
  },

  findBySlug: async (
    slug: string
  ) => {

    return prisma.article.findUnique({

      where: { slug },

      include: {

        author: true,

        category: true,

        tags: {
          include: {
            tag: true
          }
        }
      }
    })
  },

  incrementViews: async (
    slug: string
  ) => {

    return prisma.article.update({

      where: { slug },

      data: {
        views: {
          increment: 1
        }
      }
    })
  }
}
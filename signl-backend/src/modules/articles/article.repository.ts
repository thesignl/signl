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

      status: 'PUBLISHED',

      deletedAt: null
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

    return prisma.article.findFirst({

      where: {

        slug,

        status: 'PUBLISHED',

        deletedAt: null
      },

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

  update: async (

    articleId: string,

    data: any

  ) => {

    return prisma.article.update({

      where: {
        id: articleId
      },

      data
    })
  },

  delete: async (
    articleId: string
  ) => {

    return prisma.article.delete({

      where: {
        id: articleId
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
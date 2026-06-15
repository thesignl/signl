import prisma
from '../../infrastructure/prisma/client.js'

export const bookmarkRepository = {

  create: async (
    userId: string,
    articleId: string
  ) => {

    return prisma.bookmark.create({

      data: {
        userId,
        articleId
      }
    })
  },

  findExisting: async (
    userId: string,
    articleId: string
  ) => {

    return prisma.bookmark.findUnique({

      where: {

        userId_articleId: {

          userId,
          articleId
        }
      }
    })
  },

  remove: async (
    userId: string,
    articleId: string
  ) => {

    return prisma.bookmark.delete({

      where: {

        userId_articleId: {

          userId,
          articleId
        }
      }
    })
  },

  getUserBookmarks: async (
    userId: string
  ) => {

    return prisma.bookmark.findMany({

      where: {
        userId
      },

      include: {

        article: {

          include: {
            category: true
          }
        }
      },

      orderBy: {
        createdAt: 'desc'
      }
    })
  }
}
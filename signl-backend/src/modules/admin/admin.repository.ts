import prisma from "../../infrastructure/prisma/client.js"

export const adminRepository = {

  getStats: async () => {

    const [

      totalArticles,

      publishedArticles,

      draftArticles,

      totalUsers,

      totalAuthors,

      totalBookmarks

    ] = await Promise.all([

      prisma.article.count(),

      prisma.article.count({

        where: {

          status: 'PUBLISHED'
        }
      }),

      prisma.article.count({

        where: {

          status: 'DRAFT'
        }
      }),

      prisma.user.count(),

      prisma.author.count(),

      prisma.bookmark.count()
    ])

    return {

      totalArticles,

      publishedArticles,

      draftArticles,

      totalUsers,

      totalAuthors,

      totalBookmarks
    }
  },

  getUsers: async () => {

    return prisma.user.findMany({

      select: {

        id: true,

        name: true,

        email: true,

        role: true,

        createdAt: true
      },

      orderBy: {

        createdAt: 'desc'
      }
    })
  },

  updateUserRole: async (
    id: string,
    role: any
  ) => {

    return prisma.user.update({

      where: { id },

      data: { role }
    })
  },

  deleteUser: async (
    id: string
  ) => {

    await prisma.bookmark.deleteMany({
      where: {
        userId: id
      }
    })

    await prisma.readingHistory.deleteMany({
      where: {
        userId: id
      }
    })

    return prisma.user.delete({
      where: {
        id
      }
    })
  },

  getAuthors: async () => {

    return prisma.author.findMany({

      include: {

        _count: {

          select: {

            articles: true
          }
        }
      },

      orderBy: {

        name: 'asc'
      }
    })
  },

  createAuthor: async (

    data: any

  ) => {

    return prisma.author.create({

      data
    })
  },

  updateAuthor: async (

    id: string,

    data: any

  ) => {

    return prisma.author.update({

      where: {

        id
      },

      data
    })
  },

  deleteAuthor: async (
    id: string
  ) => {

    return prisma.author.delete({

      where: {

        id
      }
    })
  },

  
}
import prisma
from '../../infrastructure/prisma/client.js'
import { Prisma } from '@prisma/client'

import { CreateArticleDTO }
from './article.types.js'

/** Author fields safe to expose publicly — never includes password. */
const publicAuthorSelect = {
  id: true,
  name: true,
  slug: true,
  avatar: true,
  title: true,
  bio: true,
  twitter: true,
  linkedin: true,
} as const

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

      category: true,

      author: { select: publicAuthorSelect },

      tags: {

        include: {
          tag: true
        }
      }
    },

    orderBy: {
      createdAt: 'desc'
    },

    // Bound the homepage feed — never return the full table.
    take: 30
  })
},

search: async (
    query: string
  ) => {

    return prisma.article.findMany({

      where: {

        status: 'PUBLISHED',

        deletedAt: null,

        OR: [

          {
            title: {

              contains: query,

              mode: 'insensitive'
            }
          },

          {
            summary: {

              contains: query,

              mode: 'insensitive'
            }
          },

          {
            category: {

              name: {

                contains: query,

                mode: 'insensitive'
              }
            }
          },

          {
            tags: {

              some: {

                tag: {

                  name: {

                    contains: query,

                    mode: 'insensitive'
                  }
                }
              }
            }
          }
        ]
      },

      include: {

        category: true,

        tags: {

          include: {
            tag: true
          }
        }
      },

      orderBy: {
        publishedAt: 'desc'
      },

      take: 10
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

        category: true,

        author: { select: publicAuthorSelect },

        tags: {

          include: {
            tag: true
          }
        },

        blocks: {
          orderBy: { position: 'asc' }
        },

        analysisSteps: {
          orderBy: { stepNumber: 'asc' }
        },

        depths: true
      }
    })
  },

  findById: async (id: string) => {
    return prisma.article.findUnique({
      where: { id },
      select: { id: true, authorId: true, status: true, deletedAt: true },
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

  // Soft delete — preserves data and respects the `deletedAt: null` filter
  // used on every read path. Hard deletes would orphan analytics/bookmarks.
  delete: async (
    articleId: string
  ) => {

    return prisma.article.update({

      where: {
        id: articleId
      },

      data: {
        deletedAt: new Date(),
        status: 'ARCHIVED'
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
  },

  /**
   * Records a view accurately.
   * - Logged-in reader: a view is counted only on their FIRST read of the
   *   article. Subsequent reads/refreshes update their ReadingHistory
   *   timestamp but do NOT inflate the view count — so `views` reflects
   *   unique signed-in readers, not raw page hits.
   * - Anonymous reader: best-effort single increment (no identity to dedupe
   *   against), which is the standard limitation without session tracking.
   */
  recordView: async (
    articleId: string,
    slug: string,
    userId: string | null,
  ) => {
    if (!userId) {
      // Anonymous — cannot dedupe without a session identity.
      await prisma.article.update({
        where: { slug },
        data: { views: { increment: 1 } },
      })
      return
    }

    // Logged-in — only the first read counts as a view. We rely on the
    // @@unique([userId, articleId]) constraint as the atomic guard rather
    // than a check-then-act (which can double-count under concurrent reads):
    // attempt to CREATE the history row; if it succeeds this is the reader's
    // first read → increment. If it throws P2002 the row already exists →
    // just refresh the timestamp, no increment.
    try {
      await prisma.readingHistory.create({
        data: { userId, articleId, progress: 0 },
      })
      await prisma.article.update({
        where: { id: articleId },
        data: { views: { increment: 1 } },
      })
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        // Already read before — update last-read time only, no new view.
        await prisma.readingHistory.update({
          where: { userId_articleId: { userId, articleId } },
          data: { lastReadAt: new Date() },
        })
        return
      }
      throw err
    }
  },

  getAnalysisArticles: async () => {

    return prisma.article.findMany({

      where: {

        status: 'PUBLISHED',

        deletedAt: null,

        articleType: 'ANALYSIS'
      },

      include: {

      category: true,

      tags: {

        include: {
          tag: true
        }
      }
    }, 
    orderBy: {

      publishedAt: 'desc'
    },
    take: 40
  })
  },

  getBriefs: async () => {

  return prisma.article.findMany({

    where: {

      status: 'PUBLISHED',

      deletedAt: null,

      articleType: 'BRIEF'
    },

    include: {

       

      category: true,

      tags: {
        include: {
          tag: true
        }
      }
    },

    orderBy: {

      createdAt: 'desc'
    },
    take: 40
  })
},

getAnalysis: async () => {

  return prisma.article.findMany({

    where: {

      status: 'PUBLISHED',

      deletedAt: null,

      articleType: 'ANALYSIS'
    },

    include: {

       

      category: true
    },

    orderBy: {

      views: 'desc'
    },
    take: 12
  })
},

getFeatured: async () => {

  return prisma.article.findMany({

    where: {

      status: 'PUBLISHED',

      deletedAt: null,

      featured: true
    },

    include: {

       

      category: true
    },

    take: 1
  })
},

getLearnArticles: async () => {

  return prisma.article.findMany({

    where: {

      status: 'PUBLISHED',

      deletedAt: null,

      articleType: 'LEARN'
    },

    include: {

       

      category: true
    },

    orderBy: {

      createdAt: 'desc'
    },
    take: 40
  })
},

}
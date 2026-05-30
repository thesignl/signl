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

        author: true,

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
  },

  getAnalysisArticles: async () => {

    return prisma.article.findMany({

      where: {

        status: 'PUBLISHED',

        deletedAt: null,

        articleType: 'ANALYSIS'
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

      publishedAt: 'desc'
    }
  })
  },

  getBriefs: async () => {

  return prisma.article.findMany({

    where: {

      status: 'PUBLISHED',

      articleType: 'BRIEF'
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

getAnalysis: async () => {

  return prisma.article.findMany({

    where: {

      status: 'PUBLISHED',

      articleType: 'ANALYSIS'
    },

    include: {

      author: true,

      category: true
    },

    orderBy: {

      views: 'desc'
    }
  })
},

getFeatured: async () => {

  return prisma.article.findMany({

    where: {

      status: 'PUBLISHED',

      featured: true
    },

    include: {

      author: true,

      category: true
    },

    take: 1
  })
},

getLearnArticles: async () => {

  return prisma.article.findMany({

    where: {

      status: 'PUBLISHED',

      articleType: 'LEARN'
    },

    include: {

      author: true,

      category: true
    },

    orderBy: {

      createdAt: 'desc'
    }
  })
},

}
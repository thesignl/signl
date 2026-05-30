import { DepthType } from '@prisma/client'
import prisma
from '../../infrastructure/prisma/client.js'

export const editorRepository = {

  createDraft: async (

    data: any

  ) => {

    return prisma.article.create({

      data
    })
  },

  updateArticle: async (

    id: string,

    data: any

  ) => {

    return prisma.article.update({

      where: { id },

      data
    })
  },

  getEditorArticle: async (

    id: string

  ) => {

    return prisma.article.findUnique({

      where: { id },

      include: {

        blocks: {

          orderBy: {

            position: 'asc'
          }
        },

        depths: true,

        analysisSteps: {

          orderBy: {

            stepNumber: 'asc'
          }
        },

        tags: {

          include: {

            tag: true
          }
        }
      }
    })
  },

  createBlock: async (

  data: any

) => {

  return prisma.contentBlock.create({

    data
  })
},

updateBlock: async (

  id: string,

  data: any

) => {

  return prisma.contentBlock.update({

    where: { id },

    data
  })
},

deleteBlock: async (
  id: string
) => {

  return prisma.contentBlock.delete({

    where: { id }
  })
},
upsertDepth: async (
  articleId: string,
  depthType: DepthType,
  description?: string
) => {
  return prisma.articleDepth.upsert({
    where: {
      articleId_depthType: {
        articleId,
        depthType
      }
    },

    update: {
      description
    },

    create: {
      articleId,
      depthType,
      description
    }
  })
}
}
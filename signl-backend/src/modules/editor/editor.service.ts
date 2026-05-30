import {
  editorRepository
}
from './editor.repository.js'

export const editorService = {

  createDraft: async (

    userId: string,

    data: any

  ) => {

    return editorRepository
      .createDraft({

        ...data,

        authorId: userId,

        status: 'DRAFT'
      })
  },

  updateDraft: async (

    id: string,

    userId: string,

    data: any

  ) => {

    return editorRepository
      .updateArticle(

        id,

        {

          ...data,

          updatedById:
            userId
        }
      )
  },

  publishArticle: async (

    id: string

  ) => {

    return editorRepository
      .updateArticle(

        id,

        {

          status: 'PUBLISHED',

          publishedAt:
            new Date()
        }
      )
  }
}
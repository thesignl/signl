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

 async getDrafts(
    authorId: string
  ) {
    return editorRepository
      .getDraftsByAuthor(
        authorId
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
  },
  getEditorArticle: async (
    articleId: string,
    userId: string
    ) => {

    const article =
      await editorRepository
        .getEditorArticle(
          articleId
        )

    if (!article) {
      throw new Error(
        'Article not found'
      )
    }

    if (
      article.updatedById &&
      article.updatedById !== userId
    ) {
      throw new Error(
        'Unauthorized'
      )
    }

    return article
  },

}
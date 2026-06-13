'use client'

import { create } from 'zustand'
import type { EditorArticle } from '@/types/editor'

interface EditorStore {
  article: EditorArticle | null

  articleId: string | null

  isSaving: boolean

  lastSaved: Date | null

  setArticle: (
  article: EditorArticle | null
  ) => void

  setArticleId: (
  articleId: string | null
  ) => void

  setSaving: (
  isSaving: boolean
  ) => void

  setLastSaved: (
  lastSaved: Date | null
  ) => void

  updateTitle: (
  title: string
  ) => void

  updateSummary: (
  summary: string
  ) => void

  updateSignal: (
  signal: string
  ) => void
}

export const useEditorStore =
  create<EditorStore>((set) => ({

    article: null,

    articleId: null,

    isSaving: false,

    lastSaved: null,

    setArticle: (
    article
    ) =>
    set({
    article,
    articleId: article?.id ?? null
    }),

    setArticleId: (
    articleId
    ) =>
    set({
    articleId
    }),

    setSaving: (
    isSaving
    ) =>
    set({
    isSaving
    }),

    setLastSaved: (
    lastSaved
    ) =>
    set({
    lastSaved
    }),

    updateTitle: (
    title
    ) =>
    set((state) => ({
    article: state.article
    ? {
    ...state.article,
    title
    }
    : null
    })),

    updateSummary: (
    summary
    ) =>
    set((state) => ({
    article: state.article
    ? {
    ...state.article,
    summary
    }
    : null
    })),

    updateSignal: (
    signal
    ) =>
    set((state) => ({
    article: state.article
    ? {
    ...state.article,
    signal
    }
    : null
    })),
  }))

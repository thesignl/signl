'use client'

import { create } from 'zustand'
import type {
  Depth,
  EditorArticle,
  EditorBlock,
  EditorState,
  SaveStatus,
} from '@/types/editor'
import {
  emptyEditorState,
  makeBlock,
  slugify,
  stateFromArticle,
} from '@/features/editor/editor.helpers'

type BlockKey = 'blocks' | 'analysisBlocks'

interface EditorStore {
  state: EditorState | null
  saveStatus: SaveStatus
  lastSavedAt: string | null
  dirty: boolean

  // lifecycle
  initNew: (defaults?: { categoryId?: string; authorId?: string }) => void
  hydrate: (article: EditorArticle) => void
  reset: () => void

  // save status
  setSaveStatus: (status: SaveStatus) => void
  markSaved: () => void
  setId: (id: string) => void

  // field updates
  patch: (partial: Partial<EditorState>) => void
  setHeadline: (headline: string) => void
  setActiveDepth: (depth: Depth) => void
  toggleDepth: (depth: Depth) => void

  // summary points
  addSummaryPoint: () => void
  updateSummaryPoint: (index: number, value: string) => void
  removeSummaryPoint: (index: number) => void

  // blocks
  addBlock: (key: BlockKey, index: number, type: EditorBlock['type']) => void
  updateBlock: (key: BlockKey, index: number, patch: Partial<EditorBlock>) => void
  moveBlock: (key: BlockKey, index: number, dir: -1 | 1) => void
  duplicateBlock: (key: BlockKey, index: number) => void
  deleteBlock: (key: BlockKey, index: number) => void

  // framework
  updateStep: (index: number, text: string) => void

  // tags
  addTag: (tag: string) => void
  removeTag: (tag: string) => void
}

const dirtyPatch = { dirty: true, saveStatus: 'idle' as SaveStatus }

export const useEditorStore = create<EditorStore>((set) => ({
  state: null,
  saveStatus: 'idle',
  lastSavedAt: null,
  dirty: false,

  initNew: (defaults) =>
    set({
      state: emptyEditorState(defaults),
      saveStatus: 'idle',
      dirty: false,
      lastSavedAt: null,
    }),

  hydrate: (article) =>
    set({
      state: stateFromArticle(article),
      saveStatus: 'saved',
      dirty: false,
      lastSavedAt: article.updatedAt ?? null,
    }),

  reset: () =>
    set({ state: null, saveStatus: 'idle', dirty: false, lastSavedAt: null }),

  setSaveStatus: (saveStatus) => set({ saveStatus }),
  markSaved: () =>
    set({
      saveStatus: 'saved',
      dirty: false,
      lastSavedAt: new Date().toISOString(),
    }),
  setId: (id) =>
    set((s) =>
      s.state ? { state: { ...s.state, id, isNew: false } } : {},
    ),

  patch: (partial) =>
    set((s) =>
      s.state ? { state: { ...s.state, ...partial }, ...dirtyPatch } : {},
    ),

  setHeadline: (headline) =>
    set((s) => {
      if (!s.state) return {}
      const prevAuto = slugify(s.state.headline)
      // keep slug auto-synced until the user manually edits it
      const slug =
        !s.state.slug || s.state.slug === prevAuto
          ? slugify(headline)
          : s.state.slug
      return { state: { ...s.state, headline, slug }, ...dirtyPatch }
    }),

  setActiveDepth: (activeDepth) =>
    set((s) => (s.state ? { state: { ...s.state, activeDepth } } : {})),

  toggleDepth: (depth) =>
    set((s) => {
      if (!s.state || depth === 'summary') return {}
      const has = s.state.depths.includes(depth)
      const depths = has
        ? s.state.depths.filter((d) => d !== depth)
        : [...s.state.depths, depth]
      const activeDepth =
        has && s.state.activeDepth === depth ? 'summary' : depth
      return { state: { ...s.state, depths, activeDepth }, ...dirtyPatch }
    }),

  addSummaryPoint: () =>
    set((s) => {
      if (!s.state || s.state.summaryPoints.length >= 5) return {}
      return {
        state: { ...s.state, summaryPoints: [...s.state.summaryPoints, ''] },
        ...dirtyPatch,
      }
    }),

  updateSummaryPoint: (index, value) =>
    set((s) => {
      if (!s.state) return {}
      const summaryPoints = [...s.state.summaryPoints]
      summaryPoints[index] = value
      return { state: { ...s.state, summaryPoints }, ...dirtyPatch }
    }),

  removeSummaryPoint: (index) =>
    set((s) => {
      if (!s.state) return {}
      let summaryPoints = s.state.summaryPoints.filter((_, i) => i !== index)
      if (summaryPoints.length === 0) summaryPoints = ['']
      return { state: { ...s.state, summaryPoints }, ...dirtyPatch }
    }),

  addBlock: (key, index, type) =>
    set((s) => {
      if (!s.state) return {}
      const arr = [...s.state[key]]
      arr.splice(index, 0, makeBlock(type))
      return { state: { ...s.state, [key]: arr }, ...dirtyPatch }
    }),

  updateBlock: (key, index, patch) =>
    set((s) => {
      if (!s.state) return {}
      const arr = [...s.state[key]]
      arr[index] = { ...arr[index], ...patch }
      return { state: { ...s.state, [key]: arr }, ...dirtyPatch }
    }),

  moveBlock: (key, index, dir) =>
    set((s) => {
      if (!s.state) return {}
      const arr = [...s.state[key]]
      const ni = index + dir
      if (ni < 0 || ni >= arr.length) return {}
      ;[arr[index], arr[ni]] = [arr[ni], arr[index]]
      return { state: { ...s.state, [key]: arr }, ...dirtyPatch }
    }),

  duplicateBlock: (key, index) =>
    set((s) => {
      if (!s.state) return {}
      const arr = [...s.state[key]]
      const orig = arr[index]
      const copy: EditorBlock = {
        ...orig,
        id: makeBlock(orig.type).id,
        data: orig.data ? orig.data.map((r) => [...r]) : undefined,
      }
      arr.splice(index + 1, 0, copy)
      return { state: { ...s.state, [key]: arr }, ...dirtyPatch }
    }),

  deleteBlock: (key, index) =>
    set((s) => {
      if (!s.state) return {}
      let arr = [...s.state[key]]
      if (arr.length <= 1) arr = [makeBlock('paragraph')]
      else arr.splice(index, 1)
      return { state: { ...s.state, [key]: arr }, ...dirtyPatch }
    }),

  updateStep: (index, text) =>
    set((s) => {
      if (!s.state) return {}
      const analysisSteps = [...s.state.analysisSteps]
      analysisSteps[index] = { ...analysisSteps[index], text }
      return { state: { ...s.state, analysisSteps }, ...dirtyPatch }
    }),

  addTag: (tag) =>
    set((s) => {
      const v = tag.trim()
      if (!s.state || !v || s.state.tags.includes(v)) return {}
      return { state: { ...s.state, tags: [...s.state.tags, v] }, ...dirtyPatch }
    }),

  removeTag: (tag) =>
    set((s) => {
      if (!s.state) return {}
      return {
        state: { ...s.state, tags: s.state.tags.filter((t) => t !== tag) },
        ...dirtyPatch,
      }
    }),
}))

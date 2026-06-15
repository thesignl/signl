'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useEditorStore } from '@/store/editor.store'
import { createDraft, updateDraft } from '@/services/editor.service'
import { statePayload } from '@/features/editor/editor.helpers'

const DEBOUNCE_MS = 1200

/**
 * Editor autosave.
 *
 * Watches the store's `dirty` flag and persists after the user pauses typing.
 * For a brand-new article the first save creates the draft (and adopts the
 * returned id) so subsequent saves PATCH the same record. Save lifecycle is
 * pushed back into the store (`saving` → `saved` / `error`) for the indicator.
 */
export function useEditorAutosave() {
  const dirty = useEditorStore((s) => s.dirty)
  const inFlight = useRef(false)
  const queued = useRef(false)

  const persist = useCallback(async () => {
    const store = useEditorStore.getState()
    const state = store.state
    if (!state) return

    if (inFlight.current) {
      queued.current = true
      return
    }
    inFlight.current = true
    store.setSaveStatus('saving')

    try {
      if (!state.id || state.isNew) {
        const created = await createDraft({
          headline: state.headline,
          synopsis: state.synopsis,
          articleType: 'ARTICLE',
          categoryId: state.categoryId || undefined,
          authorId: state.authorId || undefined,
        })
        store.setId(created.id)
        await updateDraft(created.id, statePayload(useEditorStore.getState().state!))
      } else {
        await updateDraft(state.id, statePayload(state))
      }
      store.markSaved()
    } catch {
      store.setSaveStatus('error')
    } finally {
      inFlight.current = false
      if (queued.current) {
        queued.current = false
        void persist()
      }
    }
  }, [])

  useEffect(() => {
    if (!dirty) return
    const t = setTimeout(() => void persist(), DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [dirty, persist])

  return { saveNow: persist }
}

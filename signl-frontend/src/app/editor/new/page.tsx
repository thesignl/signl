'use client'

import { useEffect, useRef, useState } from 'react'

import EditorWorkspace from '@/features/editor/EditorWorkspace'
import { useEditorGuard } from '@/features/editor/useEditorGuard'
import { useEditorStore } from '@/store/editor.store'

export default function NewArticlePage() {
  const { ready } = useEditorGuard()
  const initNew = useEditorStore((s) => s.initNew)
  const started = useRef(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (ready && !started.current) {
      started.current = true
      initNew()
      setMounted(true)
    }
    // initNew is a stable store action.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  // Once initialized we keep rendering the workspace even after autosave
  // creates the draft and flips `isNew` to false — otherwise the editor would
  // unmount the instant the first edit persists.
  if (!ready || !mounted) return null
  return <EditorWorkspace />
}

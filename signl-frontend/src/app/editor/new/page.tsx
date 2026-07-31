'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { useEditorGuard } from '@/features/editor/useEditorGuard'
import { createDraft } from '@/services/editor.service'

/**
 * New-article bootstrap. Creates a blank draft via the API and redirects to
 * the unified editor at /editor/[id], so create and edit share one editor
 * (UniversalEditor) and one content model — no divergent authoring surfaces.
 */
export default function NewArticlePage() {
  const { ready } = useEditorGuard()
  const router = useRouter()
  const started = useRef(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ready || started.current) return
    started.current = true
    createDraft({ articleType: 'ARTICLE' })
      .then((draft) => router.replace(`/editor/${draft.id}`))
      .catch(() => setError('Could not create a new article. Please try again.'))
    // router is stable; createDraft is a module fn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  if (!ready) return null

  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--ink-4)',
        fontFamily: 'var(--font-mono, monospace)',
        fontSize: 13,
      }}
    >
      {error ?? 'Creating new article…'}
    </div>
  )
}

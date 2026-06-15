'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

import EditorWorkspace from '@/features/editor/EditorWorkspace'
import { useEditorGuard } from '@/features/editor/useEditorGuard'
import { useEditorStore } from '@/store/editor.store'
import { getDraft } from '@/services/editor.service'

export default function EditDraftPage() {
  const { ready } = useEditorGuard()
  const params = useParams()
  const id = params.id as string
  const hydrate = useEditorStore((s) => s.hydrate)
  const reset = useEditorStore((s) => s.reset)

  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    if (!ready || !id) return
    let alive = true
    getDraft(id)
      .then((article) => {
        if (alive) {
          hydrate(article)
          setStatus('ready')
        }
      })
      .catch(() => alive && setStatus('error'))
    return () => {
      alive = false
      reset()
    }
  }, [ready, id, hydrate, reset])

  if (!ready) return null

  if (status === 'loading') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
          color: '#6a6a66',
        }}
      >
        Loading editor…
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 12,
          fontFamily: 'var(--font-sans)',
          color: '#2a2a28',
        }}
      >
        <p>This draft could not be loaded.</p>
        <Link href="/editor" className="ed-btn ed-btn-ghost">
          ← Back to My Articles
        </Link>
      </div>
    )
  }

  return <EditorWorkspace />
}

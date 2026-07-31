'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import EditorLayout from '@/features/editor/EditorLayout'
import { useEditorGuard } from '@/features/editor/useEditorGuard'
import NewsletterComposer from '@/features/newsletter/NewsletterComposer'
import { getNewsletter } from '@/services/newsletter-admin.service'
import type { NewsletterDetail } from '@/types/newsletter'

export default function EditorComposeNewsletterPage() {
  const { ready } = useEditorGuard()
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [newsletter, setNewsletter] = useState<NewsletterDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ready || !id) return
    getNewsletter(id)
      .then(setNewsletter)
      .catch((e) =>
        setError(
          (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            'Newsletter not found.',
        ),
      )
  }, [ready, id])

  if (!ready) return null

  return (
    <EditorLayout
      activeNav="newsletters"
      crumbs={[{ label: 'Editor' }, { label: 'Newsletters', href: '/editor/newsletters' }, { label: 'Compose' }]}
    >
      <div className="ed-content-pad" style={{ padding: 20 }}>
        {error && <div className="admin-error">{error}</div>}
        {!error && !newsletter && <p className="ed-page-sub">Loading composer…</p>}
        {newsletter && <NewsletterComposer newsletter={newsletter} listHref="/editor/newsletters" />}
      </div>
    </EditorLayout>
  )
}

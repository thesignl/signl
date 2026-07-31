'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import NewsletterComposer from '@/features/newsletter/NewsletterComposer'
import { getNewsletter } from '@/services/newsletter-admin.service'
import type { NewsletterDetail } from '@/types/newsletter'

export default function ComposeNewsletterPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [newsletter, setNewsletter] = useState<NewsletterDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    getNewsletter(id)
      .then(setNewsletter)
      .catch((e) =>
        setError(
          (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            'Newsletter not found.',
        ),
      )
  }, [id])

  return (
    <>
      <div className="admin-page-head">
        <div className="admin-page-head-left">
          <Link href="/admin/campaigns" className="admin-back-link">← Campaigns</Link>
          <h1 className="admin-page-title">Compose</h1>
        </div>
      </div>

      {error && <div style={{ padding: 20 }}><div className="admin-error">{error}</div></div>}
      {!error && !newsletter && <div className="admin-loading">Loading composer…</div>}
      {newsletter && <NewsletterComposer newsletter={newsletter} />}
    </>
  )
}

'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import EditorLayout from '@/features/editor/EditorLayout'
import ArticleListView from '@/features/editor/ArticleListView'
import { useEditorGuard } from '@/features/editor/useEditorGuard'
import { useAuthStore } from '@/store/auth.store'
import { computeCounts, primeCountsCache } from '@/features/editor/useEditorCounts'
import type { EditorNav, NavCounts } from '@/features/editor/EditorSidebar'
import { listDrafts } from '@/services/editor.service'
import type { EditorArticle } from '@/types/editor'

const STATUS_TO_NAV: Record<string, EditorNav> = {
  drafts: 'drafts',
  review: 'review',
  scheduled: 'scheduled',
  published: 'published',
}

export default function EditorDashboard() {
  const { ready } = useEditorGuard()
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout)
  const params = useSearchParams()
  const statusParam = params.get('status') ?? 'all'
  const filter = (
    ['drafts', 'review', 'scheduled', 'published'].includes(statusParam)
      ? statusParam
      : 'all'
  ) as 'all' | 'drafts' | 'review' | 'scheduled' | 'published'

  const [articles, setArticles] = useState<EditorArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!ready) return
    let alive = true
    listDrafts()
      .then((data) => {
        if (alive) {
          setArticles(data)
          setError(false)
        }
      })
      .catch((err) => {
        if (!alive) return
        const status = err?.response?.status
        // Session expired or insufficient role → bounce to login.
        if (status === 401 || status === 403) {
          logout()
          router.replace('/login?next=/editor')
          return
        }
        setError(true)
      })
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [ready, logout, router])

  const counts: NavCounts = useMemo(() => {
    const next = computeCounts(articles)
    primeCountsCache(next)
    return next
  }, [articles])

  const activeNav: EditorNav = STATUS_TO_NAV[statusParam] ?? 'my-articles'
  const crumbLabel =
    filter === 'all'
      ? 'My Articles'
      : { drafts: 'Drafts', review: 'In Review', scheduled: 'Scheduled', published: 'Published' }[
          filter
        ]

  if (!ready) return null

  return (
    <EditorLayout
      activeNav={activeNav}
      counts={counts}
      crumbs={[{ label: 'Editor' }, { label: crumbLabel }]}
    >
      {loading ? (
        <div className="ed-list-page">
          <p className="ed-page-sub">Loading your articles…</p>
        </div>
      ) : error ? (
        <div className="ed-list-page">
          <p className="ed-page-sub">
            Couldn&apos;t load your articles. Check that the API is running and
            try again.
          </p>
        </div>
      ) : (
        <ArticleListView articles={articles} filter={filter} />
      )}
    </EditorLayout>
  )
}

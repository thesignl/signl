import type { Metadata } from 'next'

import { getAnalysisFeed } from '@/services/article.service'

import AnalysisFeed from '@/features/analysis/AnalysisFeed'
import FrameworkTabs from '@/features/analysis/FrameworkTabs'
import EmptyState from '@/components/ui/EmptyState'
import type { Article } from '@/types/article'

export const metadata: Metadata = {
  title: 'Analysis',
  description:
    'Deep, framework-driven analysis on macro, markets, policy and capital flows.',
}

interface PageProps {
  searchParams?: Promise<{ topic?: string }>
}

export default async function AnalysisPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {}
  const articles = await getAnalysisFeed().catch(() => [] as Article[])

  const topic = (params.topic ?? 'all').toLowerCase()
  const filtered =
    topic === 'all'
      ? articles
      : articles.filter(
          (a) => a.category?.name?.toLowerCase() === topic,
        )

  return (
    <>
      <header className="page-header-dark">
        <div className="container">
          <div className="page-eyebrow">Signl Intelligence</div>
          <h1 className="page-title">Deep systems analysis.</h1>
          <p className="page-sub">
            Macro systems, market structure, geopolitics, capital flows and
            strategic operational intelligence — distilled into reusable
            frameworks.
          </p>
        </div>
      </header>

      <div className="page-shell">
        <div className="container">
          <FrameworkTabs current={topic} />

          {filtered.length === 0 ? (
            <EmptyState
              title="No analysis in this topic yet"
              description="New work will appear here as it publishes. Try a different topic, or browse all analysis."
            />
          ) : (
            <AnalysisFeed articles={filtered} />
          )}
        </div>
      </div>
    </>
  )
}

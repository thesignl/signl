import type { Metadata } from 'next'

import { getAnalysisFeed } from '@/services/article.service'

import AnalysisFeed from '@/features/analysis/AnalysisFeed'
import EmptyState from '@/components/ui/EmptyState'
import type { Article } from '@/types/article'

export const metadata: Metadata = {
  title: 'Analysis',
  description:
    'Deep, framework-driven analysis on macro, markets, policy and capital flows.',
}

export default async function AnalysisPage() {
  const articles = await getAnalysisFeed().catch(() => [] as Article[])

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
          {articles.length === 0 ? (
            <EmptyState
              title="No analysis published yet"
              description="New work will appear here as it publishes. Check back shortly."
            />
          ) : (
            <AnalysisFeed articles={articles} />
          )}
        </div>
      </div>
    </>
  )
}

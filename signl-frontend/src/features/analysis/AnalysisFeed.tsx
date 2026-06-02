import AnalysisCard from './AnalysisCard'
import SignalCard from './SignalCard'
import type { Article } from '@/types/article'

export default function AnalysisFeed({
  articles,
}: {
  articles: Article[]
}) {
  // Surface live signals from the data itself: take the most recent
  // articles that have a `signal` set. Falls back gracefully if none.
  const signals = articles
    .filter((a) => a.signal && a.signal.trim().length > 0)
    .slice(0, 3)

  return (
    <div className="analysis-main-grid">
      <div>
        {articles.map((article) => (
          <AnalysisCard key={article.id} article={article} />
        ))}
      </div>

      <aside className="analysis-sidebar-col" aria-label="Live signals">
        {signals.length > 0
          ? signals.map((article) => (
              <SignalCard
                key={article.id}
                title={article.title}
                text={article.signal ?? ''}
              />
            ))
          : null}
      </aside>
    </div>
  )
}

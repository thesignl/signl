import type { Metadata } from 'next'

import { getLearnFeed } from '@/services/article.service'

import LearnHero from '@/features/learn/LearnHero'
import LearnFeed from '@/features/learn/LearnFeed'
import EmptyState from '@/components/ui/EmptyState'
import type { Article } from '@/types/article'

export const metadata: Metadata = {
  title: 'Learn',
  description:
    'Durable learn tracks — macroeconomics, markets, AI systems, startup mechanics, geopolitical structures.',
}

export default async function LearnPage() {
  const articles = await getLearnFeed().catch(() => [] as Article[])

  return (
    <main className="learn-page">
      <div className="container">
        <LearnHero />
        {articles.length === 0 ? (
          <EmptyState
            title="No learn tracks yet"
            description="New learn tracks will appear here as they publish. Check back shortly."
          />
        ) : (
          <LearnFeed articles={articles} />
        )}
      </div>
    </main>
  )
}

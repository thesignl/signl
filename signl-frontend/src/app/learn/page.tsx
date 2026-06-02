import type { Metadata } from 'next'

import { getLearnFeed } from '@/services/article.service'

import LearnHero from '@/features/learn/LearnHero'
import LearnFeed from '@/features/learn/LearnFeed'
import LearningTracks from '@/features/learn/LearningTracks'
import EmptyState from '@/components/ui/EmptyState'
import type { Article } from '@/types/article'

export const metadata: Metadata = {
  title: 'Learn',
  description:
    'Durable learn tracks — macroeconomics, markets, AI systems, startup mechanics, geopolitical structures.',
}

interface PageProps {
  searchParams?: Promise<{ track?: string }>
}

export default async function LearnPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {}
  const articles = await getLearnFeed().catch(() => [] as Article[])

  const track = (params.track ?? 'all').toLowerCase()
  const filtered =
    track === 'all'
      ? articles
      : articles.filter(
          (a) => a.category?.name?.toLowerCase() === track,
        )

  return (
    <main className="learn-page">
      <div className="container">
        <LearnHero />
        <LearningTracks current={track} />
        {filtered.length === 0 ? (
          <EmptyState
            title="No tracks in this category yet"
            description="More learn tracks will appear here. Try a different track, or browse all."
          />
        ) : (
          <LearnFeed articles={filtered} />
        )}
      </div>
    </main>
  )
}

import HomeAnalysisSection from '@/features/analysis/HomeAnalysisSection'
import HomeBriefSection from '@/features/briefs/HomeBriefSection'
import Hero from '@/features/home/Hero'
import HomeFeed from '@/features/home/HomeFeed'
import HomeLearnSection from '@/features/learn/HomeLearnSection'
import IntelligenceGrid from '@/features/home/IntelligenceGrid'
import NewsletterStrip from '@/components/layout/NewsletterStrip'

import { getFeaturedArticle, getFeed, getLearnFeed } from '@/services/article.service'
import type { Article } from '@/types/article'

export default async function HomePage() {
  // Fetch what each section actually needs. The featured-article
  // endpoint is the canonical "hero" — we no longer pretend
  // articles[0] is the lead. Errors are isolated per section.
  const [feed, featured, learn] = await Promise.all([
    getFeed().catch(() => [] as Article[]),
    getFeaturedArticle().catch(() => null as Article | null),
    getLearnFeed().catch(() => [] as Article[]),
  ])

  // Fall back to the freshest item only if the featured endpoint
  // returns nothing (helps in newly-seeded environments).
  const heroArticle = featured ?? feed[0] ?? null
  const feedArticles = featured
    ? feed.filter((a) => a.id !== featured.id)
    : feed.slice(1)

  return (
    <>
      {heroArticle ? <Hero article={heroArticle} /> : null}

      <HomeFeed articles={feedArticles} />

      <HomeAnalysisSection />

      <HomeBriefSection />

      <HomeLearnSection articles={learn.slice(0, 3)} />

      <IntelligenceGrid articles={feed} />

      <NewsletterStrip />
    </>
  )
}

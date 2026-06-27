import HomeAnalysisSection from '@/features/analysis/HomeAnalysisSection'
import HomeBriefSection from '@/features/briefs/HomeBriefSection'
import Hero from '@/features/home/Hero'
import HomeFeed from '@/features/home/HomeFeed'
import HomeLearnSection from '@/features/learn/HomeLearnSection'
import IntelligenceGrid from '@/features/home/IntelligenceGrid'
import NewsletterStrip from '@/components/layout/NewsletterStrip'

import {
  getFeaturedArticle,
  getFeed,
  getLearnFeed,
} from '@/services/article.service'
import type { Article } from '@/types/article'

// ISR: re-generate the homepage at most once per minute so newly published
// articles appear without a full redeploy, while keeping static-fast delivery.
// Without this the page is frozen with build-time data (new content never shows).
export const revalidate = 60

export default async function HomePage() {
  // Fetch what each section actually needs. Errors isolated per call
  // so a flaky endpoint cannot blank the entire homepage.
  const [feed, featured, learn] = await Promise.all([
    getFeed().catch(() => [] as Article[]),
    getFeaturedArticle().catch(() => null as Article | null),
    getLearnFeed().catch(() => [] as Article[]),
  ])

  const heroArticle = featured ?? feed[0] ?? null
  const remaining = featured
    ? feed.filter((a) => a.id !== featured.id)
    : feed.slice(1)

  // Top three remaining items power the hero rail; rest goes to the feed.
  const supporting = remaining.slice(0, 3)
  const feedArticles = remaining.slice(3)

  return (
    <>
      {heroArticle ? (
        <Hero article={heroArticle} supporting={supporting} />
      ) : null}

      <HomeFeed articles={feedArticles} />

      <HomeAnalysisSection />

      <HomeBriefSection />

      <HomeLearnSection articles={learn.slice(0, 3)} />

      <IntelligenceGrid articles={feed} />

      <NewsletterStrip />
    </>
  )
}

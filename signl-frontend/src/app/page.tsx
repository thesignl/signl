import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import NewsletterStrip from '@/components/layout/NewsletterStrip'
import Ticker from '@/components/layout/Ticker'
import HomeAnalysisSection from '@/features/analysis/HomeAnalysisSection'
import HomeBriefSection from '@/features/briefs/HomeBriefSection'
import Hero
from '@/features/home/Hero'
import HomeFeed from '@/features/home/HomeFeed'
import IntelligenceGrid from '@/features/home/IntelligenceGrid'

import {
  getFeed
}
from '@/services/article.service'

export default async function HomePage() {

  const articles =
    await getFeed()

  return (

    <main>

      <Ticker/>

      <Navbar/>
      
      <Hero
        article={articles[0]}
      />

      <HomeFeed
        articles={articles.slice(1)}
      />

      <HomeAnalysisSection />

      <HomeBriefSection />

      <IntelligenceGrid />

      <NewsletterStrip />

      <Footer />

    </main>
  )
}
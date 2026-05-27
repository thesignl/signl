import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import Hero
from '@/features/home/Hero'
import HomeFeed from '@/features/home/HomeFeed'

import {
  getFeed
}
from '@/services/article.service'

export default async function HomePage() {

  const articles =
    await getFeed()

  return (

    <main>

      <Navbar/>
      
      <Hero
        article={articles[0]}
      />

      <HomeFeed
        articles={articles.slice(1)}
      />

      <Footer/>

    </main>
  )
}
import Hero
from '@/app/features/home/Hero'

import {
  getFeed
}
from '@/services/article.service'

export default async function HomePage() {

  const articles =
    await getFeed()

  return (

    <main>

      <Hero
        article={articles[0]}
      />

    </main>
  )
}
import {
  getLearnFeed
}
from '@/services/article.service'

import LearnHero
from '@/features/learn/LearnHero'

import LearnFeed
from '@/features/learn/LearnFeed'

import LearningTracks
from '@/features/learn/LearningTracks'

export default async function
LearnPage() {

  const articles =
    await getLearnFeed()

  return (

    <main className="learn-page">

      <div className="container">

        <LearnHero />

        <LearningTracks />

        <LearnFeed
          articles={articles}
        />

      </div>

    </main>
  )
}
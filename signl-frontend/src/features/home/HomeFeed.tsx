import ArticleCard
from './ArticleCard'

import { Article }
from '@/types/article'

export default function HomeFeed({

  articles

}: {

  articles: Article[]
}) {

  return (

    <section className="home-feed">

      <div className="container">

        <div className="article-stack">

          {articles.map((article) => (

            <ArticleCard

              key={article.id}

              article={article}

            />

          ))}

        </div>

      </div>

    </section>
  )
}
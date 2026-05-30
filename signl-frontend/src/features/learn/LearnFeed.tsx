import LearnCard
from './LearnCard'

export default function
LearnFeed({

  articles

}: {

  articles: any[]
}) {

  return (

    <div className="learn-grid">

      {articles.map((article) => (

        <LearnCard

          key={article.id}

          article={article}

        />

      ))}

    </div>
  )
}
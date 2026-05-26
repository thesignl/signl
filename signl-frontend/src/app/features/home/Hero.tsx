import { Article }
from '@/types/article'

export default function Hero({

  article

}: {

  article: Article
}) {

  return (

    <section className="hero">

      <div className="container">

        <div className="hero-grid">

          <div className="hero-lead">

            <div className="hero-tag">

              {article.category.name}

            </div>

            <h1
              className="hero-headline"
            >

              {article.title}

            </h1>

            <p className="hero-deck">

              {article.summary}

            </p>

          </div>

        </div>

      </div>

    </section>
  )
}
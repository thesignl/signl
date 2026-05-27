import Link from 'next/link'

export default function Hero({

  article

}: any) {

  return (

    <section className="hero">

      <div className="container">

        <div className="hero-grid">

          <div className="hero-lead">

            <div className="hero-tag">

              Featured
            </div>

            <Link
              href={`/article/${article.slug}`}
            >

              <h1 className="hero-headline">

                {article.title}

              </h1>

            </Link>

            <p className="hero-deck">

              {article.summary}

            </p>

            <div className="hero-meta">

              <span>

                {article.author.name}

              </span>

              <span>

                {article.readTime}
                {' '}
                min read

              </span>

            </div>

          </div>

        </div>

      </div>

    </section>
  )
}
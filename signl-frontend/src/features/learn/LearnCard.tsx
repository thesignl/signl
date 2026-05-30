import Link from 'next/link'

export default function
LearnCard({

  article

}: {

  article: any
}) {

  return (

    <Link

      href={`/article/${article.slug}`}

      className="learn-card"

      style={{
            textDecoration: 'none',
            color: 'inherit'
        }}
    >

      <div className="learn-card-top">

        <span className="learn-tag">

          {article.category.name}

        </span>

        <span className="level-pill" style={{ backgroundColor: '#E0F7FA', color: '#00796B' }}>

          Beginner

        </span>

      </div>

      <h2 className="learn-card-title">

        {article.title}

      </h2>

      <p className="learn-card-summary">

        {article.summary}

      </p>

      <div className="learn-card-meta">

        <span>

          {article.author.name}

        </span>

        <span>
          •
        </span>

        <span>

          {article.readTime} min

        </span>

      </div>

    </Link>
  )
}
import Link from 'next/link'

export default function BriefCard({

  article

}: any) {

  return (

    <Link

      href={`/article/${article.slug}`}

      className="brief-card"
    >

      <div className="brief-card-tag">

        <span>

          {article.category.name}

        </span>

        <span>

          {article.readTime}
          {' '}
          min
        </span>

      </div>

      <h3 className="brief-card-headline">

        {article.title}

      </h3>

      <p className="brief-card-body">

        {article.summary}

      </p>

      <div className="brief-card-footer">

        <span className="brief-signal">

          {article.author.name}

        </span>

        <span className="brief-signal">

                    {article.views}
                    {' '}
                    views

        </span>

        {article.premium && (

          <span className="depth-badge pro">

            PRO
          </span>
        )}

      </div>

    </Link>
  )
}
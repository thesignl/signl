import Link from 'next/link'

import { Article }
from '@/types/article'

export default function ArticleCard({

  article

}: {

  article: Article
}) {

  return (

    <Link
      href={`/article/${article.slug}`}
      className="article-item"
    >

      <div>

        <div className="art-meta-top">

          <span className="art-tag">

            {article.category.name}

          </span>

          {article.verified && (

            <span className="verified-badge">

              ✔ Verified

            </span>
          )}

        </div>

        <h2 className="art-headline">

          {article.title}

        </h2>

        <p className="art-deck">

          {article.summary}

        </p>

        <div className="art-meta">

          <span>
            {article.author.name}
          </span>

          <span>
            {new Date(article.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>

          <span>
            {article.views} views
          </span>

        </div>

      </div>

    </Link>
  )
}
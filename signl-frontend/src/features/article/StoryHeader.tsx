import { Article }
from '@/types/article'

export default function StoryHeader({

  article

}: {

  article: Article
}) {

  return (

    <>

      <div className="story-eyebrow">

        {article.category.name}

      </div>

      <h1 className="story-headline">

        {article.title}

      </h1>

      <div className="synopsis-box">

        <div className="synopsis-label">

          Synopsis

        </div>

        <div className="synopsis-text">

          {article.summary}

        </div>

      </div>

      <div className="story-meta">

        <span className="byline">

          {article.author.name}

        </span>

        <span className="sep">

          •
        </span>

        <span>

          {new Date(
                article.createdAt
            ).toLocaleDateString(
                'en-US',
                {

                day: 'numeric',

                month: 'long',

                year: 'numeric'
                }
            )}

        </span>

        {article.verified && (

          <>
            <span className="sep">
              •
            </span>

            <span>

              ✔ Verified

            </span>
          </>
        )}

      </div>

    </>
  )
}
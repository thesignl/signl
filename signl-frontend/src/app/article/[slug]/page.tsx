import BookmarkButton from '@/features/bookmarks/BookmarkButton'
import {
  getArticle
}
from '@/services/article.service'

export default async function ArticlePage({

  params

}: {

  params: Promise<{
    slug: string
  }>
}) {

  const { slug } =
    await params

  const article =
    await getArticle(slug)

  return (

    <main className="story-page">

      <div className="story-container">

        <div className="story-eyebrow">

          {article.category.name}

        </div>

        <h1 className="story-headline">

          {article.title}

        </h1>

        <div className="story-meta">

          <span>

            {article.author.name}

          </span>

          <span className="sep">

            •

          </span>

          <span>

            {new Date(
              article.publishedAt ||
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

          <span className="sep">

            •

          </span>

          <span>

            {article.views}
            {' '}
            views

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

          {article.premium && (

            <>

              <span className="sep">

                •

              </span>

              <span>

                Premium

              </span>

            </>
          )}

        </div>

        <BookmarkButton
          article={article}
        />

        <div className="story-summary">

          {article.summary}

        </div>

        {article.coverImage && (

          <img

            src={article.coverImage}

            alt={article.title}

            className="story-cover-image"
          />
        )}

        <div className="story-summary">

          {article.summary}

        </div>

        <div className="story-body">

          {article.content.blocks.map(

            (
              block: any,
              index: number
            ) => {

              switch (block.type) {

                case 'paragraph':

                  return (

                    <p key={index}>

                      {block.content}

                    </p>
                  )

                case 'heading':

                  return (

                    <h2 key={index}>

                      {block.content}

                    </h2>
                  )

                case 'quote':

                  return (

                    <blockquote key={index}>

                      {block.content}

                    </blockquote>
                  )

                default:

                  return null
              }
            }
          )}

        </div>

      </div>

    </main>
  )
}
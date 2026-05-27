import Link from 'next/link'

import {
  getFeed
}
from '@/services/article.service'

export default async function
MostRead() {

  const articles =
    await getFeed()

  const sorted =
    [...articles]

      .sort(

        (a:any,b:any) =>

          b.views - a.views
      )

      .slice(0,5)

  return (

    <aside className="most-read">

      <div className="section-title">

        Most Read

      </div>

      {sorted.map(

        (
          article: any,
          index: number
        ) => (

          <Link

            key={article.id}

            href={`/article/${article.slug}`}

            className="mr-item"
          >

            <div className="mr-number">

              0{index + 1}

            </div>

            <div>

              <div className="mr-category">

                {article.category.name}

              </div>

              <div className="mr-headline">

                {article.title}

              </div>

            </div>

          </Link>
        )
      )}

    </aside>
  )
}
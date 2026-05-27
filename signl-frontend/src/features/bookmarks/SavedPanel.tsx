'use client'

import Link from 'next/link'

import {
  useBookmarkStore
}
from '@/store/bookmark.store'

export default function
SavedPanel() {

  const bookmarks =
    useBookmarkStore(
      state => state.bookmarks
    )

  return (

    <aside className="saved-panel">

      <div className="saved-header">

        <h3>
          Saved Stories
        </h3>

        <span>

          {bookmarks.length}
        </span>

      </div>

      <div className="saved-list">

        {bookmarks.map((bookmark) => (

          <Link

            key={bookmark.article.id}

            href={
              `/article/${bookmark.article.slug}`
            }

            className="saved-item"
          >

            <div className="saved-tag">

              {
                bookmark.article
                  .category.name
              }

            </div>

            <div className="saved-title">

              {
                bookmark.article
                  .title
              }

            </div>

            <div className="saved-meta">

              <span>

                {
                  bookmark.article
                    .author.name
                }

              </span>

              <span>
                •
              </span>

              <span>

                {
                  bookmark.article
                    .readTime
                } min

              </span>

            </div>

          </Link>

        ))}

      </div>

    </aside>
  )
}
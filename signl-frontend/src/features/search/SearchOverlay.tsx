'use client'

import { useEffect, useState }
from 'react'

import Link from 'next/link'

import {
  useSearchStore
}
from '@/store/search.store'

import {
  searchArticles
}
from '@/services/article.service'

export default function
SearchOverlay() {

  const {

    open,

    query,

    setQuery,

    closeSearch

  } = useSearchStore()

  const [results, setResults] =
    useState<any[]>([])

  useEffect(() => {

    if (!query) {

      setResults([])

      return
    }

    const timeout =
      setTimeout(async () => {

        const data =
          await searchArticles(
            query
          )

        setResults(data)

      }, 300)

    return () =>
      clearTimeout(timeout)

  }, [query])

  if (!open) return null

  return (

    <div className="search-overlay open">

      <div className="search-box">

        <div className="search-input-row">

          <input

            className="search-field"

            placeholder="Search SIGNL..."

            value={query}

            onChange={(e) =>
              setQuery(
                e.target.value
              )
            }
          />

          <button
            className="search-close"
            onClick={closeSearch}
          >

            ×

          </button>

        </div>

        <div className="search-results">

          {results.map((article) => (

            <Link

              key={article.id}

              href={`/article/${article.slug}`}

              className="search-result"
            >

              <div className="search-result-tag">

                {article.category.name}

              </div>

              <div className="search-result-title">

                {article.title}

              </div>

            </Link>

          ))}

        </div>

      </div>

    </div>
  )
}
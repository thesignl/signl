'use client'

import { useEffect, useState } from 'react'

import { getAuthors } from '@/services/admin.service'
import AuthorTable from '@/features/admin/AuthorTable'

export default function AuthorsPage() {

  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const loadAuthors = async () => {

      try {

        const data =
          await getAuthors()

        setAuthors(data)

      } catch (error) {

        console.error(error)

      } finally {

        setLoading(false)
      }
    }

    loadAuthors()

  }, [])

  if (loading) {

    return <div>Loading authors...</div>
  }

  return (

    <main>

      <h1>Authors</h1>

      <AuthorTable
        authors={authors}
      />

    </main>
  )
}
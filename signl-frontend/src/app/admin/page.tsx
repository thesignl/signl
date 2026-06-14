'use client'

import { useEffect, useState } from 'react'

import { getDashboardStats } from '@/services/admin.service'

import StatCard from '@/features/admin/StatCard'
import Link from 'next/link'

export default function AdminDashboard() {

  const [stats, setStats] =
    useState<any>(null)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    const loadDashboard =
      async () => {

        try {

          const data =
            await getDashboardStats()

          console.log(data)

          setStats(data)

        } catch (error) {

          console.error(
            'Failed to load dashboard',
            error
          )

        } finally {

          setLoading(false)
        }
      }

    loadDashboard()

  }, [])

  if (loading) {

    return (
      <main className="admin-page">
        Loading dashboard...
      </main>
    )
  }

  if (!stats) {

    return (
      <main className="admin-page">
        Failed to load dashboard
      </main>
    )
  }

  return (

    <main className="admin-page">

      <h1>
        Admin Dashboard
      </h1>

      <div className="admin-grid">

        <StatCard
          title="Articles"
          value={stats.totalArticles}
        />

        <StatCard
          title="Published"
          value={stats.publishedArticles}
        />

        <StatCard
          title="Drafts"
          value={stats.draftArticles}
        />

        <StatCard
          title="Users"
          value={stats.totalUsers}
        />

        <StatCard
          title="Authors"
          value={stats.totalAuthors}
        />

        <StatCard
          title="Bookmarks"
          value={stats.totalBookmarks}
        />

      </div>

      <div className="admin-actions">
        <div className="admin-links">

          <Link
            href="/admin/users"
            className="admin-card"
          >
            👥 Users
          </Link>

          <Link
            href="/admin/authors"
            className="admin-card"
          >
            ✍️ Authors
          </Link>

          <Link
            href="/admin/analytics"
            className="admin-card"
          >
            📊 Analytics
          </Link>

        </div>
        
      </div>

    </main>
  )
}
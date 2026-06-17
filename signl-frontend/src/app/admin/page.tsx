'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { getDashboardStats } from '@/services/admin.service'
import type { DashboardStats } from '@/types/admin'
import DashboardKpis from '@/features/admin/dashboard/DashboardKpis'
import ViewsChart from '@/features/admin/dashboard/ViewsChart'
import TrendingFeed from '@/features/admin/dashboard/TrendingFeed'
import EditorialQueue from '@/features/admin/dashboard/EditorialQueue'
import RecentActivity from '@/features/admin/dashboard/RecentActivity'

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function AdminDashboard() {
  const user = useAuthStore((s) => s.user)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((e) => setError(e?.message ?? 'Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  const firstName = user?.name?.split(' ')[0] ?? 'Admin'

  return (
    <>
      <div className="admin-page-head">
        <div className="admin-page-head-left">
          <p className="admin-greeting">{greeting()}</p>
          <h1 className="admin-page-title">{firstName}.</h1>
          <p className="admin-page-sub">{formatDate()}</p>
        </div>
        <div className="admin-page-actions">
          <a href="/admin/articles" className="admin-btn-sm admin-btn-accent">
            + New Article
          </a>
        </div>
      </div>

      {loading && (
        <div className="admin-loading">Loading dashboard…</div>
      )}

      {error && !loading && (
        <div className="admin-error">{error}</div>
      )}

      {stats && !loading && (
        <>
          <DashboardKpis stats={stats} />

          <div className="admin-dash-grid">
            <div className="admin-dash-col">
              <ViewsChart totalViews={stats.totalViews} />
              <TrendingFeed articles={stats.topTrending} />
            </div>
            <div className="admin-dash-col">
              <EditorialQueue items={stats.editorialQueue} />
              <RecentActivity items={stats.recentActivity} />
            </div>
          </div>
        </>
      )}
    </>
  )
}

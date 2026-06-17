import KpiCard from '@/features/admin/shared/KpiCard'
import type { DashboardStats } from '@/types/admin'

function ArticleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="1" width="12" height="14" rx="1" />
      <line x1="5" y1="5" x2="11" y2="5" />
      <line x1="5" y1="8" x2="11" y2="8" />
      <line x1="5" y1="11" x2="8" y2="11" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="6.5" />
      <polyline points="8,4 8,8 11,10" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="3" width="14" height="10" rx="1" />
      <path d="M1 5l7 5 7-5" />
    </svg>
  )
}

export default function DashboardKpis({ stats }: { stats: DashboardStats }) {
  return (
    <div className="admin-kpi-grid">
      <KpiCard
        label="Published"
        value={stats.publishedArticles}
        icon={<ArticleIcon />}
        iconBg="var(--accent-green-soft)"
        sub={`${stats.totalArticles} total articles`}
      />
      <KpiCard
        label="Pending Review"
        value={stats.pendingReviewCount}
        icon={<ClockIcon />}
        iconBg="var(--accent-amber-soft)"
        sub={`${stats.draftArticles} drafts`}
      />
      <KpiCard
        label="Total Views"
        value={stats.totalViews}
        icon={<EyeIcon />}
        iconBg="var(--accent-blue-soft)"
        sub="All-time across all articles"
      />
      <KpiCard
        label="Subscribers"
        value={stats.totalSubscribers}
        icon={<MailIcon />}
        iconBg="var(--accent-violet-soft)"
        sub={`${stats.totalUsers} registered users`}
      />
    </div>
  )
}

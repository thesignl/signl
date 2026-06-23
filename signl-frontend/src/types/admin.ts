export interface TrendingArticle {
  id: string
  title: string
  slug: string | null
  views: number
  readTime: number
  bookmarks: number
  categoryName: string
  authorName: string
}

export interface QueueItem {
  id: string
  title: string
  status: string
  updatedAt: string
  authorName: string
  when: string
}

export interface ActivityItem {
  type: 'published' | 'review' | 'draft' | 'user' | 'system'
  who: string
  description: string
  when: string
}

export interface DashboardStats {
  totalArticles: number
  publishedArticles: number
  draftArticles: number
  totalUsers: number
  totalEditors: number
  totalBookmarks: number
  totalViews: number
  totalSubscribers: number
  pendingReviewCount: number
  topTrending: TrendingArticle[]
  editorialQueue: QueueItem[]
  recentActivity: ActivityItem[]
}

export interface AdminArticle {
  id: string
  title: string
  slug: string | null
  status: string
  articleType: string
  premium: boolean
  featured: boolean
  views: number
  readTime: number
  publishedAt: string | null
  updatedAt: string
  createdAt: string
  author: { id: string; name: string }
  category: { id: string; name: string }
  tags: { tag: { id: string; name: string } }[]
  _count: { bookmarks: number }
}

export interface ArticleListResponse {
  articles: AdminArticle[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AdminCategory {
  id: string
  name: string
  slug: string | null
  short: string | null
  color: string | null
  description: string | null
  displayOrder: number
  active: boolean
  createdAt: string
  updatedAt: string
  _count: { articles: number }
}

export interface AdminAuthor {
  id: string
  name: string
  email: string
  slug: string | null
  title: string | null
  bio: string | null
  twitter: string | null
  linkedin: string | null
  avatar: string | null
  createdAt: string
  _count: { authoredArticles: number }
}

export interface AdminTag {
  id: string
  name: string
  slug: string | null
  _count: { articles: number }
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'USER' | 'EDITOR' | 'ADMIN'
  createdAt: string
}

export interface AdminSubscriber {
  id: string
  email: string
  createdAt: string
}

export interface SubscriberListResponse {
  subscribers: AdminSubscriber[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AnalyticsArticle {
  id: string
  title: string
  slug: string | null
  views: number
  readTime: number
  publishedAt: string | null
  categoryName: string
  authorName: string
  bookmarks: number
  analytics: {
    totalViews: number
    uniqueViews: number
    bookmarks: number
    clicks: number
    shares: number
    avgReadTime: number
    bounceRate: number
  } | null
}

export interface AnalyticsOverview {
  topArticles: AnalyticsArticle[]
  aggregates: {
    totalClicks: number
    totalShares: number
    avgBounceRate: number
    avgReadTime: number
  }
}

export interface ViewsDataPoint {
  date: string
  count: number
}

export interface PlacementArticle {
  id: string
  title: string
  slug: string | null
  coverImage: string | null
  status: string
  publishedAt: string | null
  readTime: number
  views: number
  author: { id: string; name: string }
  category: { id: string; name: string }
}

export interface AdminPlacement {
  id: string
  articleId: string
  section: string
  priority: number
  active: boolean
  createdAt: string
  updatedAt: string
  article: PlacementArticle
}

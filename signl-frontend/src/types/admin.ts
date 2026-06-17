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

import prisma from "../../infrastructure/prisma/client.js"

function relativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime()
  const diffMins = Math.floor(diffMs / 60_000)
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  return `${Math.floor(diffHours / 24)}d ago`
}

export const adminRepository = {

  getStats: async () => {

    const [
      totalArticles,
      publishedArticles,
      draftArticles,
      totalUsers,
      totalEditors,
      totalBookmarks,
      viewsAgg,
      totalSubscribers,
      pendingReviewCount,
    ] = await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { status: 'PUBLISHED' } }),
      prisma.article.count({ where: { status: 'DRAFT' } }),
      prisma.user.count(),
      prisma.user.count({ where: { role: 'EDITOR' } }),
      prisma.bookmark.count(),
      prisma.article.aggregate({ _sum: { views: true } }),
      prisma.newsletterSubscriber.count(),
      prisma.article.count({ where: { status: { in: ['DRAFT', 'REVIEW'] } } }),
    ])

    return {
      totalArticles,
      publishedArticles,
      draftArticles,
      totalUsers,
      totalEditors,
      totalBookmarks,
      totalViews: viewsAgg._sum.views ?? 0,
      totalSubscribers,
      pendingReviewCount,
    }
  },

  getTopTrending: async () => {
    const rows = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { views: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        views: true,
        readTime: true,
        category: { select: { name: true } },
        author: { select: { name: true } },
        _count: { select: { bookmarks: true } },
      },
    })
    return rows.map(a => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      views: a.views,
      readTime: a.readTime,
      bookmarks: a._count.bookmarks,
      categoryName: a.category.name,
      authorName: a.author.name,
    }))
  },

  getEditorialQueue: async () => {
    const rows = await prisma.article.findMany({
      where: { status: { in: ['DRAFT', 'REVIEW'] } },
      orderBy: { updatedAt: 'desc' },
      take: 6,
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
        author: { select: { name: true } },
      },
    })
    return rows.map(a => ({
      id: a.id,
      title: a.title,
      status: a.status as string,
      updatedAt: a.updatedAt.toISOString(),
      authorName: a.author.name,
      when: relativeTime(a.updatedAt),
    }))
  },

  getRecentActivity: async () => {
    const rows = await prisma.article.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 6,
      select: {
        title: true,
        status: true,
        updatedAt: true,
        author: { select: { name: true } },
      },
    })
    return rows.map(a => {
      const statusLabel: Record<string, string> = {
        PUBLISHED: 'published',
        DRAFT: 'saved a draft of',
        REVIEW: 'submitted for review',
        ARCHIVED: 'archived',
      }
      return {
        type: a.status === 'PUBLISHED' ? 'published' : a.status === 'REVIEW' ? 'review' : 'draft',
        who: a.author.name,
        description: `${statusLabel[a.status] ?? 'updated'} "${a.title}"`,
        when: relativeTime(a.updatedAt),
      }
    })
  },

  getUsers: async () => {

    return prisma.user.findMany({

      select: {

        id: true,

        name: true,

        email: true,

        role: true,

        createdAt: true
      },

      orderBy: {

        createdAt: 'desc'
      }
    })
  },

  updateUserRole: async (
    id: string,
    role: any
  ) => {

    return prisma.user.update({

      where: { id },

      data: { role }
    })
  },

  deleteUser: async (
    id: string
  ) => {

    await prisma.bookmark.deleteMany({
      where: {
        userId: id
      }
    })

    await prisma.readingHistory.deleteMany({
      where: {
        userId: id
      }
    })

    return prisma.user.delete({
      where: {
        id
      }
    })
  },

  // ── Articles ──────────────────────────────────────────────────

  listArticles: async (filters: {
    status?: string
    categoryId?: string
    search?: string
    page: number
    limit: number
  }) => {
    const { status, categoryId, search, page, limit } = filters

    const where: any = {
      deletedAt: null,
      ...(status && { status }),
      ...(categoryId && { categoryId }),
      ...(search && {
        title: { contains: search, mode: 'insensitive' },
      }),
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          articleType: true,
          premium: true,
          featured: true,
          views: true,
          readTime: true,
          publishedAt: true,
          updatedAt: true,
          createdAt: true,
          author: { select: { id: true, name: true } },
          category: { select: { id: true, name: true } },
          tags: { select: { tag: { select: { id: true, name: true } } } },
          _count: { select: { bookmarks: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.article.count({ where }),
    ])

    return { articles, total }
  },

  findArticleById: async (id: string) => {
    return prisma.article.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
        tags: { include: { tag: true } },
        _count: { select: { bookmarks: true } },
      },
    })
  },

  updateArticleStatus: async (id: string, status: string) => {
    const data: any = { status }
    if (status === 'PUBLISHED') {
      data.publishedAt = new Date()
    }
    return prisma.article.update({
      where: { id },
      data,
      select: { id: true, title: true, status: true, publishedAt: true },
    })
  },

  bulkUpdateArticleStatus: async (ids: string[], status: string) => {
    const data: any = { status }
    if (status === 'PUBLISHED') {
      data.publishedAt = new Date()
    }
    return prisma.article.updateMany({
      where: { id: { in: ids } },
      data,
    })
  },

  bulkDeleteArticles: async (ids: string[]) => {
    return prisma.article.deleteMany({
      where: { id: { in: ids } },
    })
  },

  // ── Authors / Editors ─────────────────────────────────────────

  listEditors: async () => {
    return prisma.user.findMany({
      where: { role: 'EDITOR' },
      select: {
        id: true,
        name: true,
        email: true,
        slug: true,
        title: true,
        bio: true,
        twitter: true,
        linkedin: true,
        avatar: true,
        createdAt: true,
        _count: { select: { authoredArticles: true } },
      },
      orderBy: { createdAt: 'asc' },
    })
  },

  findEditorById: async (id: string) => {
    return prisma.user.findFirst({
      where: { id, role: 'EDITOR' },
      select: {
        id: true,
        name: true,
        email: true,
        slug: true,
        title: true,
        bio: true,
        twitter: true,
        linkedin: true,
        avatar: true,
        createdAt: true,
        authoredArticles: {
          where: { deletedAt: null },
          select: {
            id: true,
            title: true,
            status: true,
            publishedAt: true,
            updatedAt: true,
          },
          orderBy: { updatedAt: 'desc' },
          take: 10,
        },
        _count: { select: { authoredArticles: true } },
      },
    })
  },

  updateEditorProfile: async (id: string, data: Record<string, unknown>) => {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        slug: true,
        title: true,
        bio: true,
        twitter: true,
        linkedin: true,
        avatar: true,
      },
    })
  },

  // ── Categories ────────────────────────────────────────────────

  listCategories: async () => {
    return prisma.category.findMany({
      include: {
        _count: { select: { articles: true } },
      },
      orderBy: { displayOrder: 'asc' },
    })
  },

  createCategory: async (data: {
    name: string
    slug: string
    short: string
    color?: string
    description?: string
    displayOrder?: number
  }) => {
    return prisma.category.create({ data })
  },

  updateCategory: async (id: string, data: Partial<{
    name: string
    slug: string
    short: string
    color: string
    description: string
    displayOrder: number
    active: boolean
  }>) => {
    return prisma.category.update({
      where: { id },
      data,
    })
  },

  deleteCategory: async (id: string) => {
    const articleCount = await prisma.article.count({
      where: { categoryId: id },
    })

    if (articleCount > 0) {
      throw new Error(
        `Cannot delete category: ${articleCount} article${articleCount > 1 ? 's' : ''} still assigned. Reassign them first.`
      )
    }

    return prisma.category.delete({ where: { id } })
  },

  toggleCategoryActive: async (id: string) => {
    const category = await prisma.category.findUniqueOrThrow({
      where: { id },
      select: { active: true },
    })

    return prisma.category.update({
      where: { id },
      data: { active: !category.active },
    })
  },

  // ── Tags ──────────────────────────────────────────────────────

  listTags: async () => {
    return prisma.tag.findMany({
      include: {
        _count: { select: { articles: true } },
      },
      orderBy: { name: 'asc' },
    })
  },

  createTag: async (data: { name: string; slug: string }) => {
    return prisma.tag.create({ data })
  },

  updateTag: async (id: string, data: Partial<{ name: string; slug: string }>) => {
    return prisma.tag.update({ where: { id }, data })
  },

  deleteTag: async (id: string) => {
    // ArticleTag has no cascade on Tag FK — manual cleanup required
    await prisma.articleTag.deleteMany({ where: { tagId: id } })
    return prisma.tag.delete({ where: { id } })
  },

  // ── Newsletter Subscribers ────────────────────────────────────

  listSubscribers: async (filters: { search?: string; page: number; limit: number }) => {
    const where = filters.search
      ? { email: { contains: filters.search, mode: 'insensitive' as const } }
      : {}

    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      }),
      prisma.newsletterSubscriber.count({ where }),
    ])

    return { subscribers, total }
  },

  exportSubscribers: async () => {
    return prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'asc' },
      select: { id: true, email: true, createdAt: true },
    })
  },

  // ── Analytics ─────────────────────────────────────────────────

  getAnalyticsOverview: async () => {
    const [topArticles, aggregates] = await Promise.all([
      prisma.article.findMany({
        where: { status: 'PUBLISHED', deletedAt: null },
        orderBy: { views: 'desc' },
        take: 10,
        select: {
          id: true,
          title: true,
          slug: true,
          views: true,
          readTime: true,
          publishedAt: true,
          category: { select: { name: true } },
          author: { select: { name: true } },
          analytics: {
            select: {
              totalViews: true,
              uniqueViews: true,
              bookmarks: true,
              clicks: true,
              shares: true,
              avgReadTime: true,
              bounceRate: true,
            },
          },
          _count: { select: { bookmarks: true } },
        },
      }),
      prisma.articleAnalytics.aggregate({
        _sum: { clicks: true, shares: true },
        _avg: { bounceRate: true, avgReadTime: true },
      }),
    ])

    return {
      topArticles: topArticles.map(a => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        views: a.views,
        readTime: a.readTime,
        publishedAt: a.publishedAt?.toISOString() ?? null,
        categoryName: a.category.name,
        authorName: a.author.name,
        bookmarks: a._count.bookmarks,
        analytics: a.analytics,
      })),
      aggregates: {
        totalClicks: aggregates._sum.clicks ?? 0,
        totalShares: aggregates._sum.shares ?? 0,
        avgBounceRate: Math.round((aggregates._avg.bounceRate ?? 0) * 10) / 10,
        avgReadTime: Math.round((aggregates._avg.avgReadTime ?? 0) * 10) / 10,
      },
    }
  },

  getAnalyticsViews: async (days: number) => {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    const records = await prisma.readingHistory.findMany({
      where: { lastReadAt: { gte: since } },
      select: { lastReadAt: true },
    })

    const grouped: Record<string, number> = {}
    for (const r of records) {
      const date = r.lastReadAt.toISOString().split('T')[0]
      grouped[date] = (grouped[date] ?? 0) + 1
    }

    const result: { date: string; count: number }[] = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const date = d.toISOString().split('T')[0]
      result.push({ date, count: grouped[date] ?? 0 })
    }
    return result
  },

  // ── Placement ─────────────────────────────────────────────────

  listPlacements: async () => {
    return prisma.homepagePlacement.findMany({
      include: {
        article: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true,
            status: true,
            publishedAt: true,
            readTime: true,
            views: true,
            author: { select: { id: true, name: true } },
            category: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: [{ section: 'asc' }, { priority: 'asc' }],
    })
  },

  createPlacement: async (data: { articleId: string; section: string; priority: number }) => {
    const article = await prisma.article.findUnique({
      where: { id: data.articleId },
      select: { status: true },
    })
    if (!article) throw new Error('Article not found')
    if (article.status !== 'PUBLISHED') throw new Error('Only published articles can be placed on the homepage')

    const existing = await prisma.homepagePlacement.findFirst({
      where: { articleId: data.articleId, section: data.section },
    })
    if (existing) throw new Error('This article is already placed in this section')

    return prisma.homepagePlacement.create({
      data,
      include: {
        article: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true,
            status: true,
            publishedAt: true,
            readTime: true,
            views: true,
            author: { select: { id: true, name: true } },
            category: { select: { id: true, name: true } },
          },
        },
      },
    })
  },

  updatePlacement: async (id: string, data: { priority?: number; active?: boolean }) => {
    return prisma.homepagePlacement.update({
      where: { id },
      data,
      include: {
        article: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true,
            status: true,
            publishedAt: true,
            readTime: true,
            views: true,
            author: { select: { id: true, name: true } },
            category: { select: { id: true, name: true } },
          },
        },
      },
    })
  },

  deletePlacement: async (id: string) => {
    return prisma.homepagePlacement.delete({ where: { id } })
  },
}
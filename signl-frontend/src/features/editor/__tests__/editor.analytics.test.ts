import { describe, it, expect } from 'vitest'
import {
  summarizeAnalytics,
  buildSparkline,
} from '@/features/editor/editor.analytics'
import type { EditorArticle } from '@/types/editor'

function article(partial: Partial<EditorArticle>): EditorArticle {
  return {
    id: Math.random().toString(36).slice(2),
    headline: 'X',
    deck: '',
    summary: '',
    synopsis: '',
    summaryPoints: [],
    depths: ['summary'],
    signal: '',
    slug: '',
    coverImage: '',
    premium: false,
    featured: false,
    verified: false,
    articleType: 'ARTICLE',
    status: 'PUBLISHED',
    readTime: 5,
    views: 0,
    saves: 0,
    readThrough: 0,
    publishAt: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    categoryId: '',
    authorId: '',
    category: null,
    author: null,
    tags: [],
    blocks: [],
    analysisBlocks: [],
    analysisSteps: [],
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    ...partial,
  }
}

describe('summarizeAnalytics', () => {
  it('counts only published articles and sums views', () => {
    const data = [
      article({ status: 'PUBLISHED', views: 100 }),
      article({ status: 'PUBLISHED', views: 50 }),
      article({ status: 'DRAFT', views: 999 }),
    ]
    const s = summarizeAnalytics(data)
    expect(s.totalArticles).toBe(2)
    expect(s.totalViews).toBe(150)
  })

  it('sums saves and averages read-through across published items', () => {
    const data = [
      article({ status: 'PUBLISHED', views: 100, saves: 10, readThrough: 20 }),
      article({ status: 'PUBLISHED', views: 50, saves: 6, readThrough: 40 }),
      article({ status: 'DRAFT', views: 0, saves: 99, readThrough: 99 }),
    ]
    const s = summarizeAnalytics(data)
    expect(s.totalSaves).toBe(16)
    expect(s.avgReadThrough).toBe(30)
  })

  it('sorts top articles by views descending', () => {
    const data = [
      article({ status: 'PUBLISHED', views: 10, headline: 'low' }),
      article({ status: 'PUBLISHED', views: 90, headline: 'high' }),
    ]
    expect(summarizeAnalytics(data).topByViews[0].headline).toBe('high')
  })
})

describe('buildSparkline', () => {
  it('produces a polyline and area path for a series', () => {
    const { line, area, points } = buildSparkline([1, 2, 3, 4])
    expect(points).toHaveLength(4)
    expect(line.split(' ')).toHaveLength(4)
    expect(area.startsWith('M ')).toBe(true)
  })

  it('returns empty geometry for a degenerate series', () => {
    expect(buildSparkline([5]).points).toHaveLength(0)
  })
})

import type { EditorArticle } from '@/types/editor'
import { listStatusOf } from './editor.helpers'

export interface AnalyticsSummary {
  totalViews: number
  totalSaves: number
  avgReadThrough: number
  totalArticles: number
  published: EditorArticle[]
  topByViews: EditorArticle[]
}

/** Aggregate an editor's analytics from their article list (published only). */
export function summarizeAnalytics(articles: EditorArticle[]): AnalyticsSummary {
  const published = articles.filter((a) => listStatusOf(a) === 'PUBLISHED')
  const totalViews = published.reduce((s, a) => s + (a.views ?? 0), 0)
  const totalSaves = published.reduce((s, a) => s + (a.saves ?? 0), 0)
  const withReads = published.filter((a) => (a.readThrough ?? 0) > 0)
  const avgReadThrough = withReads.length
    ? Math.round(
        withReads.reduce((s, a) => s + (a.readThrough ?? 0), 0) /
          withReads.length,
      )
    : 0
  const topByViews = [...published].sort((a, b) => b.views - a.views).slice(0, 8)
  return {
    totalViews,
    totalSaves,
    avgReadThrough,
    totalArticles: published.length,
    published,
    topByViews,
  }
}

/** Build an SVG polyline + area path for a small sparkline chart. */
export function buildSparkline(
  series: number[],
  w = 720,
  h = 180,
  pad = { l: 28, r: 12, t: 14, b: 26 },
) {
  if (series.length < 2) {
    return { line: '', area: '', points: [] as { x: number; y: number }[] }
  }
  const max = Math.max(...series)
  const min = Math.min(...series)
  const sx = (i: number) =>
    pad.l + (i * (w - pad.l - pad.r)) / (series.length - 1)
  const sy = (v: number) =>
    pad.t + (h - pad.t - pad.b) * (1 - (v - min) / (max - min || 1))
  const points = series.map((v, i) => ({ x: sx(i), y: sy(v) }))
  const line = points.map((p) => `${p.x},${p.y}`).join(' ')
  const area = `M ${sx(0)},${h - pad.b} L ${points
    .map((p) => `${p.x},${p.y}`)
    .join(' L ')} L ${sx(series.length - 1)},${h - pad.b} Z`
  return { line, area, points }
}

import type { MetadataRoute } from 'next'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://signl.media'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: `${SITE}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE}/analysis`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE}/learn`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ]
}

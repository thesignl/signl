import 'dotenv/config'
import bcrypt from 'bcrypt'
import prisma from '../src/infrastructure/prisma/client.js'

/**
 * Local seed: an EDITOR user, byline Author, categories, and a realistic set of
 * articles (published / scheduled / review / draft) with ArticleAnalytics so
 * the editor list, counts, and My Analytics view look like the reference.
 */
async function main() {
  const password = await bcrypt.hash('editor123', 10)

  const editor = await prisma.user.upsert({
    where: { email: 'editor@signl.local' },
    update: { role: 'EDITOR' },
    create: {
      email: 'editor@signl.local',
      password,
      name: 'Priya Nair',
      role: 'EDITOR',
      emailVerified: true,
    },
  })

  const author = await prisma.author.upsert({
    where: { id: 'seed-author-1' },
    update: {},
    create: {
      id: 'seed-author-1',
      name: 'Priya Nair',
      bio: 'Senior Macro Correspondent',
    },
  })

  const macro = await prisma.category.upsert({
    where: { name: 'Macro & Policy' },
    update: {},
    create: { name: 'Macro & Policy', slug: 'macro-policy' },
  })
  const markets = await prisma.category.upsert({
    where: { name: 'Markets & Capital' },
    update: {},
    create: { name: 'Markets & Capital', slug: 'markets-capital' },
  })
  const analysis = await prisma.category.upsert({
    where: { name: 'Analysis' },
    update: {},
    create: { name: 'Analysis', slug: 'analysis' },
  })

  const para = (text: string, position: number) => ({
    type: 'TEXT' as const,
    position,
    content: { refType: 'paragraph', surface: 'article', text },
  })

  type Seed = {
    slug: string
    title: string
    summary: string
    signal?: string
    category: string
    type: 'ARTICLE' | 'ANALYSIS' | 'BRIEF' | 'LEARN'
    status: 'DRAFT' | 'REVIEW' | 'PUBLISHED'
    premium: boolean
    featured?: boolean
    readTime: number
    views: number
    saves: number
    readThrough: number // %
    publishedDaysAgo?: number
    scheduledInDays?: number
  }

  const seeds: Seed[] = [
    {
      slug: 'rbi-silent-tightening',
      title:
        "The RBI's silent tightening — and why the next rate move is more complicated than it looks",
      summary:
        "The RBI hasn't cut rates, but real liquidity has tightened by 80 basis points since January.",
      signal:
        'Watch the 10-year G-Sec yield — a sustained breach above 7.10% telegraphs the next move.',
      category: macro.id,
      type: 'ANALYSIS',
      status: 'PUBLISHED',
      premium: true,
      featured: true,
      readTime: 8,
      views: 14820,
      saves: 412,
      readThrough: 12,
      publishedDaysAgo: 22,
    },
    {
      slug: 'sbi-infrastructure-bond-blitz',
      title:
        "SBI's infrastructure bond blitz: what ₹40,000 crore in issuances signals about the credit cycle",
      summary:
        'A record bond programme tells us more about the credit cycle than the headline number suggests.',
      signal: 'Track quarterly issuance pace against deposit growth.',
      category: markets.id,
      type: 'ARTICLE',
      status: 'PUBLISHED',
      premium: false,
      readTime: 6,
      views: 6440,
      saves: 148,
      readThrough: 12,
      publishedDaysAgo: 23,
    },
    {
      slug: 'rupee-pressure-fii-outflows',
      title: 'Rupee pressure mounts as FII outflows continue for a third week',
      summary:
        'Sustained foreign outflows are testing the central bank’s tolerance band.',
      signal: 'Watch RBI intervention in the NDF market.',
      category: markets.id,
      type: 'ARTICLE',
      status: 'PUBLISHED',
      premium: false,
      readTime: 6,
      views: 4980,
      saves: 96,
      readThrough: 12,
      publishedDaysAgo: 23,
    },
    {
      slug: 'cad-widens-17bn',
      title:
        "India's current account deficit widens to $17.2bn — what the numbers actually tell us",
      summary:
        'The deficit widened, but the composition matters more than the level.',
      category: macro.id,
      type: 'ARTICLE',
      status: 'PUBLISHED',
      premium: false,
      readTime: 6,
      views: 0,
      saves: 0,
      readThrough: 0,
      scheduledInDays: 2,
    },
    {
      slug: 'dollar-slow-erosion',
      title:
        "The dollar's slow erosion — and what it means for India's forex reserves strategy",
      summary:
        'Reserve diversification is quietly reshaping how the RBI manages its book.',
      category: analysis.id,
      type: 'ANALYSIS',
      status: 'REVIEW',
      premium: true,
      readTime: 12,
      views: 0,
      saves: 0,
      readThrough: 0,
    },
    {
      slug: 'rbi-gold-reserve-diversification',
      title:
        'Why the RBI keeps adding gold — and what it tells us about reserve diversification',
      summary:
        'Gold accumulation is a signal about confidence in the dollar system.',
      category: macro.id,
      type: 'ARTICLE',
      status: 'DRAFT',
      premium: false,
      readTime: 7,
      views: 0,
      saves: 0,
      readThrough: 0,
    },
  ]

  for (const s of seeds) {
    const existing = await prisma.article.findFirst({ where: { slug: s.slug } })
    if (existing) {
      await prisma.article.delete({ where: { id: existing.id } })
    }

    const publishedAt =
      s.status === 'PUBLISHED' && s.publishedDaysAgo != null
        ? new Date(Date.now() - s.publishedDaysAgo * 86_400_000)
        : s.scheduledInDays != null
          ? new Date(Date.now() + s.scheduledInDays * 86_400_000)
          : null

    const article = await prisma.article.create({
      data: {
        title: s.title,
        slug: s.slug,
        summary: s.summary,
        signal: s.signal ?? null,
        articleType: s.type,
        status: s.status,
        premium: s.premium,
        verified: s.status === 'PUBLISHED',
        featured: s.featured ?? false,
        publishedAt,
        readTime: s.readTime,
        views: s.views,
        authorId: author.id,
        categoryId: s.category,
        updatedById: editor.id,
        blocks: {
          create: [
            para(
              'The Reserve Bank of India has not moved its policy rate since February — yet treasury desks describe the past four months as distinctly tighter.',
              0,
            ),
            {
              type: 'HEADING',
              position: 1,
              content: {
                refType: 'heading',
                surface: 'article',
                text: 'What the data shows',
              },
            },
            para(
              'System liquidity has shifted from surplus to deficit since January, even without a formal rate move.',
              2,
            ),
          ],
        },
      },
    })

    // Analytics row — read-through encoded via bounceRate (100 - readThrough).
    await prisma.articleAnalytics.create({
      data: {
        articleId: article.id,
        totalViews: s.views,
        uniqueViews: Math.round(s.views * 0.82),
        bookmarks: s.saves,
        impressions: Math.round(s.views * 3.4),
        clicks: Math.round(s.views * 1.1),
        shares: Math.round(s.saves * 0.3),
        avgReadTime: (s.readThrough / 100) * s.readTime,
        bounceRate: s.readThrough > 0 ? 100 - s.readThrough : 0,
      },
    })
  }

  console.log('Seed complete. Editor login: editor@signl.local / editor123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

// prisma/seed.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // --------------------
  // Categories
  // --------------------

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: "Home" },
      update: {},
      create: {
        name: "Home",
        slug: "home",
        description: "Featured stories and editor picks",
      },
    }),

    prisma.category.upsert({
      where: { name: "Macro and Policy" },
      update: {},
      create: {
        name: "Macro and Policy",
        slug: "macro-policy",
        description: "Macroeconomics and policy",
      },
    }),

    prisma.category.upsert({
      where: { name: "Market and Capital" },
      update: {},
      create: {
        name: "Market and Capital",
        slug: "market-capital",
        description: "Markets and investments",
      },
    }),

    prisma.category.upsert({
      where: { name: "Industry and System" },
      update: {},
      create: {
        name: "Industry and System",
        slug: "industry-system",
        description: "Industry insights",
      },
    }),

    prisma.category.upsert({
      where: { name: "Infrastructure" },
      update: {},
      create: {
        name: "Infrastructure",
        slug: "infrastructure",
        description: "Infrastructure development",
      },
    }),

    prisma.category.upsert({
      where: { name: "Brief" },
      update: {},
      create: {
        name: "Brief",
        slug: "brief",
        description: "Quick insights",
      },
    }),

    prisma.category.upsert({
      where: { name: "Articles" },
      update: {},
      create: {
        name: "Articles",
        slug: "articles",
        description: "Long-form articles",
      },
    }),

    prisma.category.upsert({
      where: { name: "Analysis" },
      update: {},
      create: {
        name: "Analysis",
        slug: "analysis",
        description: "Deep analysis",
      },
    }),

    prisma.category.upsert({
      where: { name: "Learn" },
      update: {},
      create: {
        name: "Learn",
        slug: "learn",
        description: "Educational content",
      },
    }),
  ]);

  // --------------------
  // Authors
  // --------------------

  const authors = await Promise.all([
    prisma.author.create({
      data: {
        name: "Sarah Mehta",
        bio: "Policy and Economics Researcher",
      },
    }),

    prisma.author.create({
      data: {
        name: "Arjun Kapoor",
        bio: "Capital Markets Analyst",
      },
    }),

    prisma.author.create({
      data: {
        name: "Neha Bansal",
        bio: "Infrastructure Journalist",
      },
    }),

    prisma.author.create({
      data: {
        name: "Rohan Iyer",
        bio: "Industry Strategist",
      },
    }),

    prisma.author.create({
      data: {
        name: "Karan Gupta",
        bio: "Technology Writer",
      },
    }),
  ]);

  // --------------------
  // Users
  // --------------------

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "admin@signal.com",
        password: "password123",
        name: "Signal Admin",
        role: "ADMIN",
        emailVerified: true,
      },
    }),

    prisma.user.create({
      data: {
        email: "editor@signal.com",
        password: "password123",
        name: "Signal Editor",
        role: "EDITOR",
        emailVerified: true,
      },
    }),

    prisma.user.create({
      data: {
        email: "john@gmail.com",
        password: "password123",
        name: "John Doe",
      },
    }),

    prisma.user.create({
      data: {
        email: "jane@gmail.com",
        password: "password123",
        name: "Jane Doe",
      },
    }),

    prisma.user.create({
      data: {
        email: "alex@gmail.com",
        password: "password123",
        name: "Alex Brown",
      },
    }),
  ]);

  // --------------------
  // Tags
  // --------------------

  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: "AI" },
      update: {},
      create: { name: "AI", slug: "ai" },
    }),

    prisma.tag.upsert({
      where: { name: "Economy" },
      update: {},
      create: { name: "Economy", slug: "economy" },
    }),

    prisma.tag.upsert({
      where: { name: "Markets" },
      update: {},
      create: { name: "Markets", slug: "markets" },
    }),

    prisma.tag.upsert({
      where: { name: "Infrastructure" },
      update: {},
      create: { name: "Infrastructure", slug: "infrastructure" },
    }),

    prisma.tag.upsert({
      where: { name: "India" },
      update: {},
      create: { name: "India", slug: "india" },
    }),
  ]);

  // --------------------
  // Articles
  // --------------------

  const article1 = await prisma.article.create({
    data: {
      title: "India’s Manufacturing Push: Can PLI Deliver?",
      slug: "india-manufacturing-pli",
      summary:
        "Evaluating India's Production Linked Incentive scheme.",
      contentText:
        "The PLI scheme aims to transform India's manufacturing sector.",
      signal:
        "Manufacturing competitiveness is becoming central to India's growth.",
      articleType: "ANALYSIS",
      status: "PUBLISHED",
      featured: true,
      verified: true,
      views: 1500,
      readTime: 8,

      authorId: authors[0].id,
      categoryId: categories[1].id,
      publishedAt: new Date(),
    },
  });

  const article2 = await prisma.article.create({
    data: {
      title: "Why Bond Markets Matter More Than Ever",
      slug: "bond-markets-explained",
      summary: "Understanding the signal hidden inside bond yields.",
      contentText:
        "Bond markets frequently provide forward-looking economic signals.",
      signal:
        "Yield curves continue to influence monetary expectations.",
      articleType: "LEARN",
      status: "PUBLISHED",
      verified: true,
      views: 900,
      readTime: 6,

      authorId: authors[1].id,
      categoryId: categories[8].id,
      publishedAt: new Date(),
    },
  });

  const article3 = await prisma.article.create({
    data: {
      title: "India’s Data Center Boom",
      slug: "data-center-boom",
      summary:
        "AI demand is driving massive infrastructure investment.",
      contentText:
        "Data centers have become strategic infrastructure assets.",
      signal:
        "AI infrastructure spending is accelerating rapidly.",
      articleType: "ARTICLE",
      status: "PUBLISHED",
      featured: true,
      verified: true,
      views: 2400,
      readTime: 10,

      authorId: authors[2].id,
      categoryId: categories[4].id,
      publishedAt: new Date(),
    },
  });

  const article4 = await prisma.article.create({
    data: {
      title: "RBI Holds Rates: What It Means",
      slug: "rbi-rate-decision",
      summary:
        "Quick brief on the latest RBI monetary policy decision.",
      contentText:
        "The RBI maintained rates amid inflation uncertainty.",
      signal:
        "Rate stability indicates a cautious monetary stance.",
      articleType: "BRIEF",
      status: "PUBLISHED",
      verified: true,
      views: 700,
      readTime: 3,

      authorId: authors[3].id,
      categoryId: categories[5].id,
      publishedAt: new Date(),
    },
  });

  const article5 = await prisma.article.create({
    data: {
      title: "Understanding AI Agents",
      slug: "understanding-ai-agents",
      summary:
        "A beginner-friendly guide to agentic systems.",
      contentText:
        "AI agents combine planning, memory and tool use.",
      signal:
        "Agentic systems are transforming software development.",
      articleType: "LEARN",
      status: "PUBLISHED",
      featured: true,
      verified: true,
      views: 1800,
      readTime: 12,

      authorId: authors[4].id,
      categoryId: categories[8].id,
      publishedAt: new Date(),
    },
  });

  // --------------------
  // Content Blocks
  // --------------------

  await prisma.contentBlock.createMany({
    data: [
      {
        articleId: article1.id,
        type: "HEADING",
        content: {
          text: "India Manufacturing Story",
        },
        position: 1,
      },

      {
        articleId: article1.id,
        type: "TEXT",
        content: {
          text: "Manufacturing is becoming a strategic priority.",
        },
        position: 2,
      },

      {
        articleId: article2.id,
        type: "TEXT",
        content: {
          text: "Bond yields reveal future expectations.",
        },
        position: 1,
      },

      {
        articleId: article3.id,
        type: "TEXT",
        content: {
          text: "AI is driving data center growth.",
        },
        position: 1,
      },

      {
        articleId: article5.id,
        type: "TEXT",
        content: {
          text: "Agents combine reasoning and actions.",
        },
        position: 1,
      },
    ],
  });

  // --------------------
  // Analytics
  // --------------------

  await prisma.articleAnalytics.createMany({
    data: [
      {
        articleId: article1.id,
        totalViews: 1500,
        uniqueViews: 1200,
        bookmarks: 120,
      },

      {
        articleId: article2.id,
        totalViews: 900,
        uniqueViews: 700,
        bookmarks: 60,
      },

      {
        articleId: article3.id,
        totalViews: 2400,
        uniqueViews: 2000,
        bookmarks: 200,
      },

      {
        articleId: article4.id,
        totalViews: 700,
        uniqueViews: 650,
        bookmarks: 40,
      },

      {
        articleId: article5.id,
        totalViews: 1800,
        uniqueViews: 1500,
        bookmarks: 110,
      },
    ],
  });

  console.log("✅ Database seeded successfully");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
  
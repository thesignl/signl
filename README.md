# Signl

> **Operational intelligence made understandable.**

A reading-first publication for investors, operators, analysts and the financially curious. Signl is built around a single editorial discipline: every story explains the system, not just the headline — what changed, why it changed, how it transmits, who absorbs it, and what to monitor next.

This repository contains the full Signl platform — a Node + Express + Prisma backend, and a Next.js 16 reading experience.

<sub>Pre-launch · Editorial-first · Operational intelligence</sub>

---

## The thesis

Most coverage answers a single question: **what happened.**
Signl answers the harder ones.

- **Why** it happened.
- **How** systems interact.
- **How** the change transmits — macro → meso → micro.
- **Who** absorbs the operational consequence.
- **What** risks matter, and **what** would falsify the call.
- **What** to monitor next.

We hold both registers — accessible enough for the financially curious learner, rigorous enough for the institutional reader — and we refuse the middle ground that produces neither.

---

## Who it’s for

| Reader                                   | What they get                                                                  |
| ---------------------------------------- | ------------------------------------------------------------------------------ |
| **Investors**                            | Frameworks for transmission, second-order effects, invalidation triggers.      |
| **Operators & founders**                 | Operational consequences — margins, incentives, capacity, capital allocation.  |
| **Analysts & researchers**               | Evidence-dense, numerically literate breakdowns with historical benchmarking.  |
| **Policy-aware professionals**           | Macro → meso → micro mapping with institutional context.                       |
| **Financially curious learners**         | Plain-language explainers that build durable economic and financial literacy.  |

---

## Product surfaces

**Summary**  ·  A fast, structured read of an event or trend — the version you’d brief a colleague with on the way to a meeting.

**Article**  ·  Long-form factual reporting. Hard numbers, historical framing, institutional context.

**Analysis** *(the core product)*  ·  Full operational decomposition. Macro → meso → micro, second-order effects, scenario maps, invalidation triggers, strategic takeaways.

**Learn**  ·  Evergreen, beginner-accessible explainers. *How inflation works. How the repo rate transmits. Why oil moves the rupee.*

---

## The 5-step analysis engine

Every major analysis follows the same disciplined arc — so the reader always knows where they are, and the writer always knows what they owe.

1. **Catalyst** — what changed, and how we know.
2. **Structural context** — the system the change lands in.
3. **Transmission & impact** — how it propagates through prices, margins, capital, capacity.
4. **Outlook & invalidation** — what we expect, and what would falsify it.
5. **Strategic takeaway** — the one thing to hold from the piece.

Layered through every step:

> **Macro** — policy, cycles, capital flows.
> **Meso** — industries, sectors, infrastructure systems, institutional incentives.
> **Micro** — companies, margins, utilization, execution constraints.

---

## What Signl is not

We choose what to leave out as carefully as what to publish.

- No outrage journalism, ideological tribalism, or engagement farming.
- No hot takes, fear narratives, or hype-cycle commentary.
- No trading signals, buy/sell calls, or personalized investment advice.
- No flashy chrome — gradients, glassmorphism, scroll-jacked theatrics.
- No middle ground. Either the rigour earns its place, or it doesn’t ship.

---

## Repository layout

```
signl/
├── signl-backend/                 # API · Node · Express · Prisma · PostgreSQL
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/            #   versioned migrations
│   └── src/
│       ├── modules/               #   articles · auth · bookmark · editor · newsletter
│       ├── infrastructure/        #   prisma client · logger
│       ├── shared/                #   error handler · async helper
│       ├── app.ts
│       └── server.ts
│
└── signl-frontend/                # Web · Next.js 16 (App Router) · React 19
    ├── public/
    └── src/
        ├── app/                   #   routes · layout · loading · error · sitemap · robots
        ├── components/
        │   ├── layout/            #   Navbar · Footer · Ticker · NewsletterStrip
        │   ├── ui/                #   Button · Field · Dialog · Toast · Badge · Skeleton …
        │   └── common/            #   Auth · Bookmarks · Toast providers
        ├── features/
        │   ├── home/              #   Hero · HomeFeed · ArticleCard · IntelligenceGrid
        │   ├── article/           #   StoryContent · StorySignal · StoryPaywall · Reading…
        │   ├── analysis/          #   AnalysisCard · FrameworkTabs · SignalCard
        │   ├── learn/             #   LearnHero · LearnCard · LearningTracks
        │   ├── briefs/            #   BriefCard
        │   ├── search/            #   command palette
        │   └── bookmarks/         #   BookmarkButton · SavedPanel
        ├── services/              #   axios-backed API clients
        ├── store/                 #   Zustand: auth · bookmarks · search
        ├── hooks/
        ├── lib/
        └── types/
```

---

## Getting started

### Prerequisites

- Node.js **22+**
- PostgreSQL **15+**
- npm (or pnpm)

### 1 · Install

```bash
git clone https://github.com/Youranalyst-coder/signl.git
cd signl

# backend
cd signl-backend && npm install && cd ..

# frontend
cd signl-frontend && npm install && cd ..
```

### 2 · Configure environment

`signl-backend/.env`

```ini
DATABASE_URL="postgresql://user:password@localhost:5432/signl"
JWT_ACCESS_SECRET="replace-with-a-long-random-string"
PORT=5000
```

`signl-frontend/.env.local`

```ini
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3 · Database

```bash
cd signl-backend
npx prisma migrate dev
npx prisma generate
```

### 4 · Run

In two terminals:

```bash
# terminal 1 — API
cd signl-backend && npm run dev

# terminal 2 — Web
cd signl-frontend && npm run dev
```

Web app at `http://localhost:3000` · API at `http://localhost:5000/api`.

---

## Tech stack

| Layer                | Choice                                                              | Why                                                                                              |
| -------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Web framework**    | Next.js 16 (App Router)                                             | RSC by default; routes, loading and error boundaries co-located.                                 |
| **UI runtime**       | React 19                                                            | Server components, Suspense, actions where they earn their place.                                |
| **Language**         | TypeScript (strict)                                                 | Public types under `src/types/`. Zero `any` in app code.                                          |
| **Styling**          | Tailwind v4 (CSS-first `@theme`) + design tokens                    | One source of truth. Tokens for surfaces, content, accent, focus.                                |
| **Type system**      | Source Serif 4 · Inter · JetBrains Mono                             | Editorial · UI · Data — all variable, all loaded via `next/font` (zero CLS).                     |
| **State**            | Zustand                                                             | Three small single-purpose stores: auth, bookmarks, search.                                      |
| **HTTP**             | Axios with a single interceptor                                     | One auth-transport pattern; services stay token-agnostic.                                        |
| **Server**           | Node + Express                                                      | Modular by domain in `signl-backend/src/modules/`.                                               |
| **Database**         | PostgreSQL via Prisma                                               | Migrations versioned in `prisma/migrations/`. Indexed on slug, status, articleType, publishedAt. |
| **Auth**             | JWT                                                                 | Issued at login; attached client-side via the axios interceptor.                                 |
| **Background work**  | BullMQ (where needed)                                               | Newsletter dispatch and async editorial workflows.                                               |

---

## Frontend design system

The Signl interface is intentionally **paper-warm** by default, with darker surfaces reserved for analytical density (deep analysis, signal cards, footer, paywall). Type carries the editorial voice; chrome stays out of the way.

- **Surfaces** — paper, raised, sunken, inverse — every pair WCAG 2.2 AA verified.
- **Content tiers** — primary / secondary / tertiary / muted — each meets 4.5:1 minimum.
- **Accent** — a single restrained editorial red. Not retail, not crypto.
- **Motion** — 120–220 ms, eased with a Linear-style cubic-bezier. `prefers-reduced-motion` honoured.
- **A11y** — visible `:focus-visible`, focus-trapped dialogs, skip-link, semantic landmarks, `role` and `aria-*` where they earn it.
- **Print** — chrome hidden, body preserved. The article reads on paper.

---

## API surface

The backend exposes a small, predictable JSON API (returns `{ success, data, message? }`).

```
GET    /api/articles                       # feed
GET    /api/articles/featured              # featured story
GET    /api/articles/analysis              # analysis index
GET    /api/articles/analysis/feed         # analysis feed
GET    /api/articles/briefs                # briefs
GET    /api/articles/learn/feed            # learn tracks
GET    /api/articles/search?q=…            # full-text search
GET    /api/articles/:slug                 # one article

POST   /api/auth/signup
POST   /api/auth/login

GET    /api/bookmarks                      # auth required
POST   /api/bookmarks
DELETE /api/bookmarks/:articleId

POST   /api/newsletter/subscribe
```

Editor and admin routes are scoped behind role-based authorization (`ADMIN`, `EDITOR`).

---

## Status

**Stage.** Pre-launch — execution phase.

**Done.**
Positioning · analytical architecture · 5-step analysis framework · editorial pipeline · publishing model · brand identity · MVP web experience (institutional design system, app shell, search command palette, bookmarks, reading polish, error boundaries, SEO, sitemap, robots).

**Next.**
Public launch · sustained publishing cadence · evidence-quality refinement · SEO and distribution · premium subscription infrastructure · reading-history surface · author profiles.

---

## Contributing

Signl is currently a focused single-author effort. If you find something specific the product would benefit from, please open an issue first — the editorial voice is intentional, and we’d rather discuss the change before code lands.

When you do contribute:

- Keep the calm, deliberate tone in copy and visual decisions.
- No new dependencies without a clear justification — every package is a future tax.
- Backend and frontend are decoupled: a change in one shouldn’t require a change in the other.
- Type-safety and accessibility are non-negotiable.
- Match the existing module shape — domain folders, services as thin clients, server components for data fetching, client islands for interaction.

---

## License

Source code in this repository is © Signl Media. All rights reserved.
Editorial content published on signl.media is © its respective authors and Signl Media.

---

<p align="center"><sub>Signal over noise.</sub></p>

export type SubscriptionPlan = 'FREE' | 'PRO'

export interface PlanDefinition {
  id: SubscriptionPlan
  name: string
  description: string
  price: number
  currency: string
  interval: 'monthly' | null
  features: string[]
}

export const PLAN_DEFINITIONS: PlanDefinition[] = [
  {
    id: 'FREE',
    name: 'Signl Free',
    description: 'Intelligence-first editorial, open to all.',
    price: 0,
    currency: 'INR',
    interval: null,
    features: [
      'All published articles',
      'Briefs and learn tracks',
      'Bookmarks',
      'Newsletter',
    ],
  },
  {
    id: 'PRO',
    name: 'Signl Pro',
    description: 'Full access including premium analysis and exclusive signals.',
    price: 49900,
    currency: 'INR',
    interval: 'monthly',
    features: [
      'Everything in Free',
      'Premium articles',
      'Deep analysis',
      'Exclusive signals',
      'Early access to new formats',
    ],
  },
]

export const PLANS = Object.fromEntries(
  PLAN_DEFINITIONS.map((p) => [p.id, p])
) as Record<SubscriptionPlan, PlanDefinition>

export const PRO_PLAN_DURATION_DAYS = 30

import type { ReactNode } from 'react'
import type { PlanDefinition } from '@/types/subscription'
import { cn } from '@/lib/cn'

interface PlanCardProps {
  plan: PlanDefinition
  highlighted?: boolean
  cta: ReactNode
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8l3.5 3.5L13 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CrossIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

// All features across both plans — used to build the comparison table.
// Order matters: items that FREE includes appear first.
const ALL_FEATURES = [
  'All published articles',
  'Briefs and learn tracks',
  'Bookmarks',
  'Newsletter',
  'Premium articles',
  'Deep analysis',
  'Exclusive signals',
  'Early access to new formats',
]

export default function PlanCard({ plan, highlighted, cta }: PlanCardProps) {
  const price =
    plan.price === 0
      ? 'Free'
      : `₹${(plan.price / 100).toLocaleString('en-IN')}`

  return (
    <div className={cn('plan-card', highlighted && 'plan-card--pro')}>
      {highlighted && <div className="plan-card-flag">Most popular</div>}

      <div className="plan-card-header">
        <div className="plan-card-name">{plan.name}</div>
        <div className="plan-card-price">
          <span className="plan-price-amount">{price}</span>
          {plan.interval && (
            <span className="plan-price-interval">/ {plan.interval}</span>
          )}
        </div>
        <p className="plan-card-desc">{plan.description}</p>
      </div>

      <div className="plan-card-cta">{cta}</div>

      <ul className="plan-feature-list" aria-label={`${plan.name} features`}>
        {ALL_FEATURES.map((feature) => {
          const included =
            plan.id === 'PRO' ? true : plan.features.includes(feature)
          return (
            <li
              key={feature}
              className={cn(
                'plan-feature-item',
                !included && 'plan-feature-item--unavail',
              )}
            >
              <span className={included ? 'plan-feat-check' : 'plan-feat-cross'}>
                {included ? <CheckIcon /> : <CrossIcon />}
              </span>
              {feature}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

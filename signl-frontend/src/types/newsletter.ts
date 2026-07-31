export type NewsletterStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED'
export type CampaignStatus =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'SENDING'
  | 'SENT'
  | 'FAILED'
  | 'ARCHIVED'

export interface NewsletterCategory {
  id: string
  name: string
  slug: string
  description: string | null
  active: boolean
  displayOrder: number
}

export interface NewsletterListItem {
  id: string
  title: string
  subject: string
  status: NewsletterStatus
  createdAt: string
  updatedAt: string
  category?: { name: string } | null
  author?: { name: string } | null
  _count?: { campaigns: number }
}

export interface NewsletterDetail {
  id: string
  title: string
  subject: string
  preheader: string | null
  contentHtml: string | null
  contentJson: unknown
  status: NewsletterStatus
  categoryId: string | null
  templateId: string | null
  category?: NewsletterCategory | null
}

export interface CampaignListItem {
  id: string
  subject: string
  status: CampaignStatus
  scheduledAt: string | null
  startedAt: string | null
  completedAt: string | null
  totalRecipients: number
  sentCount: number
  deliveredCount: number
  openCount: number
  clickCount: number
  bounceCount: number
  failedCount: number
  unsubscribeCount: number
  createdAt: string
  newsletter?: { title: string; category?: { name: string } | null } | null
}

export interface PreviewResult {
  html: string
  subject: string
  text: string
}

export interface AudienceEstimate {
  count: number
}

export interface NewsletterInput {
  title?: string
  subject?: string
  preheader?: string | null
  contentHtml?: string | null
  contentJson?: unknown
  categoryId?: string | null
  templateId?: string | null
  status?: NewsletterStatus
}

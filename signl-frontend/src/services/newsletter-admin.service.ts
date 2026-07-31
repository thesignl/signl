import api from '@/lib/axios'
import type {
  NewsletterCategory,
  NewsletterListItem,
  NewsletterDetail,
  NewsletterInput,
  CampaignListItem,
  PreviewResult,
  AudienceEstimate,
} from '@/types/newsletter'

// ── Categories (configurable newsletter types) ───────────────────────────────
export async function listNewsletterCategories(): Promise<NewsletterCategory[]> {
  const res = await api.get('/campaigns/categories')
  return res.data.data
}

export async function createNewsletterCategory(data: {
  name: string
  description?: string
  displayOrder?: number
}): Promise<NewsletterCategory> {
  const res = await api.post('/campaigns/categories', data)
  return res.data.data
}

export async function toggleNewsletterCategory(id: string): Promise<NewsletterCategory> {
  const res = await api.patch(`/campaigns/categories/${id}/toggle`)
  return res.data.data
}

// ── Newsletters (documents) ──────────────────────────────────────────────────
export async function listNewsletters(): Promise<NewsletterListItem[]> {
  const res = await api.get('/campaigns/newsletters')
  return res.data.data
}

export async function getNewsletter(id: string): Promise<NewsletterDetail> {
  const res = await api.get(`/campaigns/newsletters/${id}`)
  return res.data.data
}

export async function createNewsletter(data: NewsletterInput): Promise<NewsletterDetail> {
  const res = await api.post('/campaigns/newsletters', data)
  return res.data.data
}

export async function updateNewsletter(
  id: string,
  data: NewsletterInput,
): Promise<NewsletterDetail> {
  const res = await api.patch(`/campaigns/newsletters/${id}`, data)
  return res.data.data
}

export async function deleteNewsletter(id: string): Promise<void> {
  await api.delete(`/campaigns/newsletters/${id}`)
}

export async function previewNewsletter(id: string): Promise<PreviewResult> {
  const res = await api.get(`/campaigns/newsletters/${id}/preview`)
  return res.data.data
}

export async function estimateAudience(id: string): Promise<AudienceEstimate> {
  const res = await api.get(`/campaigns/newsletters/${id}/audience`)
  return res.data.data
}

export async function sendNewsletterNow(
  id: string,
): Promise<{ campaignId: string; status: string }> {
  const res = await api.post(`/campaigns/newsletters/${id}/send`)
  return res.data.data
}

export async function scheduleNewsletter(
  id: string,
  scheduledAt: string,
): Promise<{ campaignId: string; status: string; scheduledAt: string }> {
  const res = await api.post(`/campaigns/newsletters/${id}/schedule`, { scheduledAt })
  return res.data.data
}

// ── Campaigns (send instances) ───────────────────────────────────────────────
export async function listCampaigns(): Promise<CampaignListItem[]> {
  const res = await api.get('/campaigns')
  return res.data.data
}

export async function getCampaign(id: string): Promise<CampaignListItem> {
  const res = await api.get(`/campaigns/${id}`)
  return res.data.data
}

export async function cancelCampaignSchedule(id: string): Promise<void> {
  await api.post(`/campaigns/${id}/cancel`)
}

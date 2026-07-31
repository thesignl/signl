import api
from '@/lib/axios'

export const subscribeNewsletter =
async (
  email: string
) => {

  const response =

    await api.post(

      '/newsletter/subscribe',

      {
        email
      }
    )

  return response.data
}

export interface PreferenceCategory {
  id: string
  name: string
  slug: string
  description: string | null
  subscribed: boolean
}

export interface PreferencesResponse {
  email: string
  status: string
  categories: PreferenceCategory[]
}

export async function getNewsletterPreferences(
  token: string,
): Promise<PreferencesResponse> {
  const res = await api.get(`/newsletter/preferences?token=${encodeURIComponent(token)}`)
  return res.data.data
}

export async function updateNewsletterPreferences(
  token: string,
  preferences: { categoryId: string; subscribed: boolean }[],
): Promise<void> {
  await api.post('/newsletter/preferences', { token, preferences })
}

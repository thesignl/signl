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
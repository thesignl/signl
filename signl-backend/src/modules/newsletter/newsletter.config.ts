/**
 * Newsletter module configuration — reads from env with safe launch defaults.
 * Centralized so URLs and branding are consistent across confirm/unsubscribe
 * links, campaign rendering, and the queue.
 */
export const newsletterConfig = {
  /** Public site URL — used for links inside emails and web-view fallbacks. */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? 'https://signl.media',

  /** API base URL — used to build tokenized confirm/unsubscribe endpoints. */
  apiUrl: process.env.PUBLIC_API_URL ?? 'http://localhost:5000/api',

  /** From identity for outbound mail. */
  from: process.env.EMAIL_FROM ?? 'Signl <brief@signl.media>',

  brand: {
    name: 'Signl',
    tagline: 'Signal over noise.',
    accent: '#b8392b',
    ink: '#1a1a18',
    paper: '#faf8f3',
    muted: '#6b6b66',
  },

  /** Whether new signups require email confirmation (double opt-in). */
  doubleOptIn: (process.env.NEWSLETTER_DOUBLE_OPT_IN ?? 'true').toLowerCase() !== 'false',
} as const

/** Tokenized public URLs delivered inside every email. */
export const buildConfirmUrl = (token: string) =>
  `${newsletterConfig.apiUrl}/newsletter/confirm?token=${encodeURIComponent(token)}`

export const buildUnsubscribeUrl = (token: string) =>
  `${newsletterConfig.apiUrl}/newsletter/unsubscribe?token=${encodeURIComponent(token)}`

export const buildPreferencesUrl = (token: string) =>
  `${newsletterConfig.siteUrl}/newsletter/preferences?token=${encodeURIComponent(token)}`

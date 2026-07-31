import { newsletterConfig } from '../newsletter.config.js'

const { brand } = newsletterConfig

interface RenderOptions {
  subject: string
  preheader?: string
  /** Inner body HTML (already sanitized) — placed inside the branded shell. */
  bodyHtml: string
  unsubscribeUrl: string
  preferencesUrl?: string
}

/**
 * Wraps sanitized body HTML in a branded, email-client-safe shell.
 *
 * Uses table-based layout + inline styles because email clients (Gmail,
 * Outlook, Apple Mail) strip <style> blocks and ignore modern CSS. This is
 * the single source of truth for newsletter branding: header, footer,
 * unsubscribe, and social — editors never recreate it.
 */
export function renderBrandedEmail(opts: RenderOptions): string {
  const { subject, preheader, bodyHtml, unsubscribeUrl, preferencesUrl } = opts

  const preheaderBlock = preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(
        preheader,
      )}</div>`
    : ''

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${brand.paper};color:${brand.ink};font-family:Georgia,'Times New Roman',serif;-webkit-text-size-adjust:100%;">
  ${preheaderBlock}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${brand.paper};">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #eae6dd;border-radius:8px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:28px 32px 20px;border-bottom:1px solid #eae6dd;">
              <a href="${newsletterConfig.siteUrl}" style="text-decoration:none;color:${brand.ink};font-size:22px;font-weight:700;letter-spacing:-0.02em;">
                ${brand.name}<span style="color:${brand.accent};">.</span>
              </a>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;font-size:16px;line-height:1.6;color:${brand.ink};">
              ${bodyHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px 32px;border-top:1px solid #eae6dd;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:${brand.muted};">
              <p style="margin:0 0 8px;">${escapeHtml(brand.tagline)}</p>
              <p style="margin:0;">
                You are receiving this because you subscribed to ${brand.name}.
                <br />
                <a href="${unsubscribeUrl}" style="color:${brand.muted};text-decoration:underline;">Unsubscribe</a>
                ${
                  preferencesUrl
                    ? ` &nbsp;·&nbsp; <a href="${preferencesUrl}" style="color:${brand.muted};text-decoration:underline;">Manage preferences</a>`
                    : ''
                }
              </p>
              <p style="margin:12px 0 0;color:#a8a49c;">© ${new Date().getFullYear()} ${brand.name} Media</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

/**
 * Small transactional email (confirm opt-in) — a single centered CTA button.
 */
export function renderTransactionalEmail(opts: {
  subject: string
  heading: string
  message: string
  ctaLabel: string
  ctaUrl: string
}): string {
  const bodyHtml = `
    <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:${brand.ink};">${escapeHtml(
      opts.heading,
    )}</h1>
    <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:${brand.ink};">${escapeHtml(
      opts.message,
    )}</p>
    <table role="presentation" cellpadding="0" cellspacing="0">
      <tr>
        <td style="border-radius:6px;background:${brand.accent};">
          <a href="${opts.ctaUrl}" style="display:inline-block;padding:12px 24px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:6px;">
            ${escapeHtml(opts.ctaLabel)}
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:24px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${brand.muted};">
      If the button doesn't work, paste this link into your browser:<br />
      <span style="color:${brand.accent};word-break:break-all;">${opts.ctaUrl}</span>
    </p>`

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${escapeHtml(
    opts.subject,
  )}</title></head>
<body style="margin:0;padding:0;background:${brand.paper};font-family:Georgia,serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${brand.paper};">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid #eae6dd;border-radius:8px;">
        <tr><td style="padding:28px 32px 16px;border-bottom:1px solid #eae6dd;">
          <span style="font-size:22px;font-weight:700;color:${brand.ink};">${brand.name}<span style="color:${brand.accent};">.</span></span>
        </td></tr>
        <tr><td style="padding:32px;">${bodyHtml}</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

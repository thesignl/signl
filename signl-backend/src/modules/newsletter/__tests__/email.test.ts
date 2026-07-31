import { describe, it, expect, beforeEach } from 'vitest'
import { htmlToText } from '../email/email.types.js'
import { getEmailProvider, resetEmailProvider } from '../email/index.js'

describe('htmlToText', () => {
  it('strips tags and preserves block breaks', () => {
    const out = htmlToText('<h1>Hi</h1><p>One</p><p>Two</p>')
    expect(out).toContain('Hi')
    expect(out).toContain('One')
    expect(out).toContain('Two')
    expect(out).not.toContain('<')
  })

  it('decodes common entities and drops script/style', () => {
    const out = htmlToText('<style>.x{}</style><p>A &amp; B</p><script>evil()</script>')
    expect(out).toBe('A & B')
  })
})

describe('getEmailProvider', () => {
  beforeEach(() => {
    resetEmailProvider()
    delete process.env.EMAIL_PROVIDER
  })

  it('defaults to the console provider when unconfigured', () => {
    expect(getEmailProvider().name).toBe('console')
  })

  it('selects resend when EMAIL_PROVIDER=resend', () => {
    process.env.EMAIL_PROVIDER = 'resend'
    resetEmailProvider()
    expect(getEmailProvider().name).toBe('resend')
  })

  it('falls back to console for an unknown provider', () => {
    process.env.EMAIL_PROVIDER = 'nope'
    resetEmailProvider()
    expect(getEmailProvider().name).toBe('console')
  })

  it('console provider returns a synthetic message id without throwing', async () => {
    resetEmailProvider()
    const provider = getEmailProvider()
    const result = await provider.send({
      to: 'reader@example.com',
      subject: 'Test',
      html: '<p>Hello</p>',
    })
    expect(result.provider).toBe('console')
    expect(result.messageId).toMatch(/^console_/)
  })
})

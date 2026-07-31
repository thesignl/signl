import { describe, it, expect } from 'vitest'
import { createHmac } from 'crypto'
import { verifyResendSignature } from '../campaign.webhook.js'

/**
 * Builds a valid Svix signature the same way Resend does, so we can assert our
 * verifier accepts genuine signatures and rejects tampered ones.
 */
function sign(rawBody: Buffer, secret: string, id: string, timestamp: string): string {
  const secretBytes = Buffer.from(secret.replace(/^whsec_/, ''), 'base64')
  const signedContent = `${id}.${timestamp}.${rawBody.toString('utf8')}`
  const sig = createHmac('sha256', secretBytes).update(signedContent).digest('base64')
  return `v1,${sig}`
}

describe('verifyResendSignature', () => {
  const secret = 'whsec_' + Buffer.from('super-secret-signing-key-1234567890').toString('base64')
  const body = Buffer.from(JSON.stringify({ type: 'email.opened', data: { email_id: 'abc' } }))
  const id = 'msg_123'
  const timestamp = '1700000000'

  it('accepts a correctly signed payload', () => {
    const signature = sign(body, secret, id, timestamp)
    expect(verifyResendSignature(body, { id, timestamp, signature }, secret)).toBe(true)
  })

  it('rejects a tampered body', () => {
    const signature = sign(body, secret, id, timestamp)
    const tampered = Buffer.from(JSON.stringify({ type: 'email.clicked', data: { email_id: 'abc' } }))
    expect(verifyResendSignature(tampered, { id, timestamp, signature }, secret)).toBe(false)
  })

  it('rejects when headers are missing', () => {
    expect(verifyResendSignature(body, {}, secret)).toBe(false)
  })

  it('rejects a wrong secret', () => {
    const signature = sign(body, secret, id, timestamp)
    const otherSecret = 'whsec_' + Buffer.from('a-different-key').toString('base64')
    expect(verifyResendSignature(body, { id, timestamp, signature }, otherSecret)).toBe(false)
  })

  it('accepts when multiple space-separated signatures include a valid one', () => {
    const good = sign(body, secret, id, timestamp)
    const signature = `v1,invalidsig ${good}`
    expect(verifyResendSignature(body, { id, timestamp, signature }, secret)).toBe(true)
  })
})

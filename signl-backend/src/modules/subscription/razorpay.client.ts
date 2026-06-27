import Razorpay from 'razorpay'
import crypto from 'crypto'

let _instance: Razorpay | null = null

function getInstance(): Razorpay {
  if (!_instance) {
    const key_id = process.env.RAZORPAY_KEY_ID
    const key_secret = process.env.RAZORPAY_KEY_SECRET
    if (!key_id || !key_secret) {
      throw Object.assign(
        new Error('Payment processing is not configured. Contact support.'),
        { status: 503 }
      )
    }
    _instance = new Razorpay({ key_id, key_secret })
  }
  return _instance
}

export interface RazorpayOrder {
  id: string
  amount: number
  currency: string
  receipt: string
  status: string
}

export const razorpayClient = {
  createOrder: async (
    amount: number,
    currency: string,
    receipt: string
  ): Promise<RazorpayOrder> => {
    const rz = getInstance()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw: any = await rz.orders.create({
      amount,
      currency,
      receipt,
      payment_capture: 1,
    } as Parameters<typeof rz.orders.create>[0])
    return {
      id: raw.id as string,
      amount: Number(raw.amount),
      currency: raw.currency as string,
      receipt: raw.receipt as string,
      status: raw.status as string,
    }
  },

  // Verifies the signature Razorpay sends to the client after payment.
  // Formula: HMAC-SHA256(orderId + '|' + paymentId, KEY_SECRET)
  verifyOrderSignature: (
    orderId: string,
    paymentId: string,
    signature: string
  ): boolean => {
    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) return false
    // Reject obviously malformed signatures up front. Without this guard,
    // Buffer.from('xx', 'hex') of an odd-length / non-hex input returns a
    // truncated buffer and crypto.timingSafeEqual throws RangeError on
    // mismatched lengths — turning a forged-signature request into a 500.
    if (typeof signature !== 'string' || !/^[a-f0-9]{64}$/i.test(signature)) {
      return false
    }
    const expected = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex')
    const expectedBuf = Buffer.from(expected, 'hex')
    const providedBuf = Buffer.from(signature, 'hex')
    if (expectedBuf.length !== providedBuf.length) return false
    return crypto.timingSafeEqual(expectedBuf, providedBuf)
  },
}

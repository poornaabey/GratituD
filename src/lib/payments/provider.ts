/**
 * Provider-agnostic payment interface.
 * Primary gateway: PayHere (LKR, Sri Lanka).
 */

export interface CreateCheckoutInput {
  orderId: string
  /** All order IDs in this checkout batch (multi-box cart). */
  orderIds?: string[]
  amountLkrCents: number
  customerEmail: string
  customerName: string
  customerPhone?: string
  address?: string
  city?: string
  itemsDescription?: string
  successUrl: string
  cancelUrl: string
}

export interface CreateCheckoutResult {
  /** Internal redirect (PayHere form page) or return URL after payment. */
  redirectUrl: string
  reference: string
}

export interface WebhookVerificationResult {
  orderRef: string
  paid: boolean
  paymentRef?: string
}

export interface PaymentProvider {
  readonly name: "payhere"
  createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult>
  /** Verify PayHere notify_url POST body (application/x-www-form-urlencoded). */
  verifyWebhook(
    rawBody: string,
    signature?: string
  ): Promise<WebhookVerificationResult | null>
}

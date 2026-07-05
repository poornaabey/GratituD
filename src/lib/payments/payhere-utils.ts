import crypto from "node:crypto"

export interface PayHereConfig {
  merchantId: string
  merchantSecret: string
  sandbox: boolean
  checkoutUrl: string
  siteUrl: string
}

export function resolveMerchantSecret(raw: string): string {
  // Use exactly what PayHere dashboard shows — do not transform.
  return raw.trim()
}

export function getPayHereConfig(): PayHereConfig {
  const env =
    process.env.NEXT_PUBLIC_PAYHERE_ENV ??
    (process.env.NEXT_PUBLIC_PAYHERE_SANDBOX !== "false"
      ? "sandbox"
      : "production")
  const sandbox = env !== "production"

  const merchantId = (
    process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID ??
    process.env.PAYHERE_MERCHANT_ID ??
    ""
  ).trim()

  return {
    merchantId,
    merchantSecret: resolveMerchantSecret(process.env.PAYHERE_MERCHANT_SECRET ?? ""),
    sandbox,
    checkoutUrl: sandbox
      ? "https://sandbox.payhere.lk/pay/checkout"
      : "https://www.payhere.lk/pay/checkout",
    siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3003").trim(),
  }
}

/** PayHere JS SDK script URL for the active environment. */
export function getPayHereSdkUrl(config: PayHereConfig): string {
  return config.sandbox
    ? "https://sandbox.payhere.lk/lib/payhere.js"
    : "https://www.payhere.lk/lib/payhere.js"
}

/** PayHere order_id must not contain hyphens (use compact UUID). */
export function toPayHereOrderId(orderUuid: string): string {
  return orderUuid.replace(/-/g, "")
}

/** Restore UUID from PayHere order_id callback. */
export function fromPayHereOrderId(orderId: string): string {
  if (orderId.includes("-")) return orderId
  if (orderId.length !== 32) return orderId
  return `${orderId.slice(0, 8)}-${orderId.slice(8, 12)}-${orderId.slice(12, 16)}-${orderId.slice(16, 20)}-${orderId.slice(20)}`
}

export function getPayHereCheckoutBaseUrl(config: PayHereConfig): string {
  const override = process.env.PAYHERE_CHECKOUT_BASE_URL?.trim()
  if (override) return override.replace(/\/$/, "")
  return config.siteUrl.replace(/\/$/, "")
}

export function getPayHereNotifyBaseUrl(config: PayHereConfig): string {
  const override = process.env.PAYHERE_NOTIFY_URL?.trim()
  if (override) return override.replace(/\/$/, "")
  return config.siteUrl.replace(/\/$/, "")
}

/** Hostname registered in PayHere for checkout return/cancel URLs. */
export function getPayHereDomain(config: PayHereConfig): string | null {
  try {
    return new URL(getPayHereCheckoutBaseUrl(config)).hostname
  } catch {
    return null
  }
}

export function getPayHereNotifyDomain(config: PayHereConfig): string | null {
  try {
    return new URL(getPayHereNotifyBaseUrl(config)).hostname
  } catch {
    return null
  }
}

export function isPayHereConfigured(config: PayHereConfig): boolean {
  return Boolean(config.merchantId && config.merchantSecret)
}

/** LKR cents → PayHere amount string e.g. "5800.00" */
export function formatPayHereAmount(lkrCents: number): string {
  return (lkrCents / 100).toFixed(2)
}

/** Checkout request hash (server-side only). */
export function generateCheckoutHash(
  merchantId: string,
  orderId: string,
  amountFormatted: string,
  currency: string,
  merchantSecret: string
): string {
  const hashedSecret = crypto
    .createHash("md5")
    .update(merchantSecret)
    .digest("hex")
    .toUpperCase()

  return crypto
    .createHash("md5")
    .update(merchantId + orderId + amountFormatted + currency + hashedSecret)
    .digest("hex")
    .toUpperCase()
}

/** Verify PayHere notify_url POST (md5sig). status_code 2 = success. */
export function verifyNotificationHash(params: {
  merchantId: string
  orderId: string
  payhereAmount: string
  payhereCurrency: string
  statusCode: string
  md5sig: string
  merchantSecret: string
}): boolean {
  const hashedSecret = crypto
    .createHash("md5")
    .update(params.merchantSecret)
    .digest("hex")
    .toUpperCase()

  const local = crypto
    .createHash("md5")
    .update(
      params.merchantId +
        params.orderId +
        params.payhereAmount +
        params.payhereCurrency +
        params.statusCode +
        hashedSecret
    )
    .digest("hex")
    .toUpperCase()

  return local === params.md5sig.toUpperCase()
}

export function splitCustomerName(fullName: string): {
  firstName: string
  lastName: string
} {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "." }
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  }
}

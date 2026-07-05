/** Client-safe PayHere config (public env vars only). */
export function getPayHereClientConfig() {
  const env = process.env.NEXT_PUBLIC_PAYHERE_ENV ?? "sandbox"
  const sandbox = env !== "production"
  const merchantId = (process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID ?? "").trim()
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    ""
  )

  return { sandbox, merchantId, siteUrl, notifyUrl: `${siteUrl}/api/payhere/notify` }
}

export function getPayHereSdkScriptUrl(): string {
  const { sandbox } = getPayHereClientConfig()
  return sandbox
    ? "https://sandbox.payhere.lk/lib/payhere.js"
    : "https://www.payhere.lk/lib/payhere.js"
}

/** LKR cents → PayHere amount string e.g. "5800.00" */
export function formatPayHereAmountClient(lkrCents: number): string {
  return (lkrCents / 100).toFixed(2)
}

export function splitCustomerName(fullName: string): {
  firstName: string
  lastName: string
} {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "." }
  }
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") }
}

/** PayHere order_id must not contain hyphens (use compact UUID). */
export function toPayHereOrderId(orderUuid: string): string {
  return orderUuid.replace(/-/g, "")
}

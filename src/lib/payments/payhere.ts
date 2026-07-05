import type { PaymentProvider } from "./provider"
import {
  formatPayHereAmount,
  generateCheckoutHash,
  getPayHereConfig,
  isPayHereConfigured,
  normalizePayHerePhone,
  splitCustomerName,
  verifyNotificationHash,
} from "./payhere-utils"

export const payHereProvider: PaymentProvider = {
  name: "payhere",

  async createCheckout(input) {
    const config = getPayHereConfig()
    const orderIds = input.orderIds ?? [input.orderId]
    const ordersQuery = orderIds.join(",")

    // Demo / dev mode when merchant credentials are not configured
    if (!isPayHereConfigured(config)) {
      const sep = input.successUrl.includes("?") ? "&" : "?"
      return {
        redirectUrl: `${input.successUrl}${sep}demo=1`,
        reference: "demo",
      }
    }

    // Internal page builds the signed POST form and auto-submits to PayHere
    return {
      redirectUrl: `${config.siteUrl}/checkout/payhere?orders=${ordersQuery}`,
      reference: input.orderId,
    }
  },

  async verifyWebhook(rawBody) {
    const config = getPayHereConfig()
    if (!isPayHereConfigured(config)) return null

    const params = new URLSearchParams(rawBody)

    const merchantId = params.get("merchant_id") ?? ""
    const orderId = params.get("order_id") ?? ""
    const payhereAmount = params.get("payhere_amount") ?? ""
    const payhereCurrency = params.get("payhere_currency") ?? ""
    const statusCode = params.get("status_code") ?? ""
    const md5sig = params.get("md5sig") ?? ""
    const paymentId = params.get("payment_id") ?? orderId

    if (
      !verifyNotificationHash({
        merchantId,
        orderId,
        payhereAmount,
        payhereCurrency,
        statusCode,
        md5sig,
        merchantSecret: config.merchantSecret,
      })
    ) {
      return null
    }

    // PayHere: status_code 2 = success
    const paid = statusCode === "2"

    return { orderRef: orderId, paid, paymentRef: paymentId }
  },
}

/** Build PayHere Checkout API form fields (server-side only). */
export function buildPayHereCheckoutFields(input: {
  orderId: string
  amountLkrCents: number
  items: string
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  city: string
  returnUrl: string
  cancelUrl: string
  notifyUrl: string
}): Record<string, string> {
  const config = getPayHereConfig()
  const currency = "LKR"
  const amount = formatPayHereAmount(input.amountLkrCents)
  const { firstName, lastName } = splitCustomerName(input.customerName)

  const hash = generateCheckoutHash(
    config.merchantId,
    input.orderId,
    amount,
    currency,
    config.merchantSecret
  )

  return {
    merchant_id: config.merchantId,
    return_url: input.returnUrl,
    cancel_url: input.cancelUrl,
    notify_url: input.notifyUrl,
    order_id: input.orderId,
    items: input.items,
    amount,
    currency,
    hash,
    first_name: firstName,
    last_name: lastName,
    email: input.customerEmail,
    phone: normalizePayHerePhone(input.customerPhone),
    address: input.address,
    city: input.city,
    country: "Sri Lanka",
  }
}

export {
  fromPayHereOrderId,
  getPayHereCheckoutBaseUrl,
  getPayHereConfig,
  getPayHereDomain,
  getPayHereNotifyBaseUrl,
  getPayHereNotifyDomain,
  getPayHereSdkUrl,
  isPayHereConfigured,
  resolveMerchantSecret,
  toPayHereOrderId,
} from "./payhere-utils"

import { markOrdersPaid } from "@/lib/actions/checkout"
import { resolveOrderBatch } from "@/lib/actions/payhere-checkout"
import {
  fromPayHereOrderId,
  getPayHereConfig,
  verifyNotificationHash,
} from "@/lib/payments/payhere-utils"

/**
 * PayHere notify_url server-to-server callback.
 * PayHere POSTs application/x-www-form-urlencoded data.
 */
export async function handlePayHereNotify(request: Request): Promise<Response> {
  const config = getPayHereConfig()

  if (!config.merchantId || !config.merchantSecret) {
    return new Response("PayHere not configured", { status: 500 })
  }

  const rawBody = await request.text()
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
    return new Response("Invalid signature", { status: 400 })
  }

  // PayHere: status_code 2 = success
  if (statusCode !== "2") {
    return new Response("OK", { status: 200 })
  }

  const orderIds = await resolveOrderBatch(fromPayHereOrderId(orderId))
  await markOrdersPaid(orderIds, paymentId)

  return new Response("OK", { status: 200 })
}

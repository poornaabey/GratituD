import { handlePayHereNotify } from "@/lib/payments/payhere-notify-handler"

/**
 * POST /api/payhere/notify
 * PayHere server-to-server notify_url webhook.
 *
 * Verifies md5sig:
 * MD5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + MD5(merchant_secret).toUpperCase()).toUpperCase()
 */
export async function POST(request: Request) {
  return handlePayHereNotify(request)
}

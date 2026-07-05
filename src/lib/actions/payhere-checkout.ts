"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import {
  buildPayHereCheckoutFields,
  getPayHereConfig,
  getPayHereDomain,
  getPayHereCheckoutBaseUrl,
  getPayHereNotifyBaseUrl,
  getPayHereNotifyDomain,
  isPayHereConfigured,
  toPayHereOrderId,
} from "@/lib/payments/payhere"

export interface PayHereCheckoutPayload {
  action: string
  fields: Record<string, string>
}

export async function getPayHereCheckoutPayload(
  orderIdsParam: string
): Promise<
  { ok: true; data: PayHereCheckoutPayload } | { ok: false; error: string }
> {
  const orderIds = orderIdsParam.split(",").filter(Boolean)
  if (!orderIds.length) {
    return { ok: false, error: "Missing order reference." }
  }

  const config = getPayHereConfig()
  if (!isPayHereConfigured(config)) {
    return { ok: false, error: "PayHere is not configured." }
  }

  const notifyDomain = getPayHereNotifyDomain(config)
  if (
    !notifyDomain ||
    notifyDomain === "localhost" ||
    notifyDomain.startsWith("127.")
  ) {
    return {
      ok: false,
      error:
        "PayHere notify_url must be public HTTPS. Set PAYHERE_NOTIFY_URL=https://YOUR-NGROK.ngrok-free.dev",
    }
  }

  const checkoutBase = getPayHereCheckoutBaseUrl(config)
  const notifyBase = getPayHereNotifyBaseUrl(config)

  const admin = createAdminClient()
  const { data: orders, error } = await admin
    .from("orders")
    .select("*")
    .in("id", orderIds)

  if (error || !orders?.length) {
    return { ok: false, error: "Order not found." }
  }

  const pending = orders.every((o) => o.status === "pending")
  if (!pending) {
    return { ok: false, error: "This order has already been processed." }
  }

  const primary = orders[0]
  const grandTotal = orders.reduce((sum, o) => sum + o.total_lkr, 0)
  const items =
    orders.length === 1
      ? "GratituD Gift Box"
      : `GratituD Gift Boxes (${orders.length})`

  const fields = buildPayHereCheckoutFields({
    orderId: toPayHereOrderId(primary.id),
    amountLkrCents: grandTotal,
    items,
    customerName: primary.contact_name,
    customerEmail: primary.contact_email,
    customerPhone: primary.contact_phone,
    address: primary.address_line1,
    city: primary.city,
    returnUrl: `${checkoutBase}/checkout/success?orders=${orderIds.join(",")}`,
    cancelUrl: `${checkoutBase}/checkout?cancelled=1`,
    notifyUrl: `${notifyBase}/api/payhere/notify`,
  })

  return {
    ok: true,
    data: {
      action: config.checkoutUrl,
      fields,
    },
  }
}

/** Resolve batch order IDs from primary order (stored at checkout time). */
export async function resolveOrderBatch(primaryOrderId: string): Promise<string[]> {
  const admin = createAdminClient()
  const { data: order } = await admin
    .from("orders")
    .select("payment_ref")
    .eq("id", primaryOrderId)
    .single()

  if (order?.payment_ref?.startsWith("batch:")) {
    return order.payment_ref.replace("batch:", "").split(",").filter(Boolean)
  }

  return [primaryOrderId]
}

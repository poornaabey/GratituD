"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import {
  getPayHereConfig,
  isPayHereConfigured,
} from "@/lib/payments/payhere-utils"
import type { CartBox } from "@/types/cart"
import type { DeliveryZone, OrderStatus } from "@/types/db"

export interface CheckoutInput {
  boxes: CartBox[]
  contactName: string
  contactEmail: string
  contactPhone: string
  addressLine1: string
  addressLine2?: string
  city: string
  zoneId: string
  deliveryDate: string
  deliveryNotes?: string
}

export interface CheckoutResult {
  orderIds: string[]
  primaryOrderId: string
  amountLkrCents: number
  itemsDescription: string
  /** Present only for sandbox demo skip. */
  redirectUrl?: string
}

export async function placeOrder(
  input: CheckoutInput,
  options?: { sandboxDemo?: boolean }
): Promise<{ ok: true; data: CheckoutResult } | { ok: false; error: string }> {
  if (!input.boxes.length) {
    return { ok: false, error: "Your cart is empty." }
  }

  const supabase = await createClient()
  const admin = createAdminClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: zoneRaw, error: zoneError } = await supabase
    .from("delivery_zones")
    .select("*")
    .eq("id", input.zoneId)
    .single()

  const zone = zoneRaw as DeliveryZone | null

  if (zoneError || !zone) {
    return { ok: false, error: "Invalid delivery zone." }
  }

  const boxesSubtotal = input.boxes.reduce((s, b) => s + b.subtotalLkr, 0)
  const deliveryFee = zone.fee_lkr
  const grandTotal = boxesSubtotal + deliveryFee

  const orderIds: string[] = []

  // Split delivery fee across orders (first order carries full fee; rest zero)
  for (let i = 0; i < input.boxes.length; i++) {
    const box = input.boxes[i]
    const feeForOrder = i === 0 ? deliveryFee : 0
    const orderTotal = box.subtotalLkr + feeForOrder

    const { data: customBoxRaw, error: boxError } = await admin
      .from("custom_boxes")
      .insert({
        profile_id: user?.id ?? null,
        packaging_id: box.packaging.id,
        greeting_card_id: box.greetingCard?.id ?? null,
        recipient_name: box.recipientName || null,
        gift_note: box.giftNote || null,
        subtotal_lkr: box.subtotalLkr,
      })
      .select("id")
      .single()

    const customBox = customBoxRaw as { id: string } | null

    if (boxError || !customBox) {
      return { ok: false, error: boxError?.message ?? "Failed to save gift box." }
    }

    const lineRows = box.items.map((line) => ({
      custom_box_id: customBox.id,
      product_id: line.product.id,
      quantity: line.quantity,
      unit_price_lkr: line.product.price_lkr,
    }))

    const { error: itemsError } = await admin
      .from("custom_box_items")
      .insert(lineRows)

    if (itemsError) {
      return { ok: false, error: itemsError.message }
    }

    const { data: orderRaw, error: orderError } = await admin
      .from("orders")
      .insert({
        profile_id: user?.id ?? null,
        custom_box_id: customBox.id,
        status: "pending" satisfies OrderStatus,
        contact_name: input.contactName,
        contact_email: input.contactEmail,
        contact_phone: input.contactPhone,
        address_line1: input.addressLine1,
        address_line2: input.addressLine2 ?? null,
        city: input.city,
        zone_id: zone.id,
        delivery_date: input.deliveryDate,
        delivery_notes: input.deliveryNotes ?? null,
        subtotal_lkr: box.subtotalLkr,
        delivery_fee_lkr: feeForOrder,
        total_lkr: orderTotal,
        payment_provider: "payhere",
      })
      .select("id")
      .single()

    const order = orderRaw as { id: string } | null

    if (orderError || !order) {
      return { ok: false, error: orderError?.message ?? "Failed to create order." }
    }

    const orderItemRows = box.items.map((line) => ({
      order_id: order.id,
      product_name: line.product.name,
      quantity: line.quantity,
      unit_price_lkr: line.product.price_lkr,
    }))

    const { error: orderItemsError } = await admin
      .from("order_items")
      .insert(orderItemRows)

    if (orderItemsError) {
      return { ok: false, error: orderItemsError.message }
    }

    orderIds.push(order.id)
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3003"
  const primaryOrderId = orderIds[0]

  const itemsDescription =
    input.boxes.length === 1
      ? "GratituD Gift Box"
      : `GratituD Gift Boxes (${input.boxes.length})`

  // Tag batch so notify_url can mark all related orders paid
  await admin
    .from("orders")
    .update({ payment_ref: `batch:${orderIds.join(",")}` })
    .in("id", orderIds)

  if (options?.sandboxDemo) {
    return {
      ok: true,
      data: {
        orderIds,
        primaryOrderId: primaryOrderId,
        amountLkrCents: grandTotal,
        itemsDescription,
        redirectUrl: `${siteUrl}/checkout/success?orders=${orderIds.join(",")}&demo=1`,
      },
    }
  }

  const config = getPayHereConfig()
  if (!isPayHereConfigured(config)) {
    return {
      ok: false,
      error:
        "PayHere is not configured. Add NEXT_PUBLIC_PAYHERE_MERCHANT_ID and PAYHERE_MERCHANT_SECRET, or use sandbox demo.",
    }
  }

  return {
    ok: true,
    data: {
      orderIds,
      primaryOrderId,
      amountLkrCents: grandTotal,
      itemsDescription,
    },
  }
}

/** Mark orders paid (webhook or demo mode). Uses service role. */
export async function markOrdersPaid(
  orderIds: string[],
  paymentRef: string
): Promise<void> {
  const admin = createAdminClient()
  await admin
    .from("orders")
    .update({
      status: "paid",
      payment_ref: paymentRef,
      paid_at: new Date().toISOString(),
    })
    .in("id", orderIds)
}

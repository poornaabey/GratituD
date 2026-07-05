import { NextResponse } from "next/server"
import { z } from "zod"

import {
  generateCheckoutHash,
  getPayHereConfig,
  isPayHereConfigured,
} from "@/lib/payments/payhere-utils"

const hashRequestSchema = z.object({
  order_id: z.string().min(1).max(100),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Amount must be a decimal with up to 2 places"),
  currency: z
    .string()
    .length(3)
    .transform((c) => c.toUpperCase())
    .optional(),
})

function formatAmount(amount: string): string {
  const n = Number.parseFloat(amount)
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error("Invalid amount")
  }
  return n.toFixed(2)
}

/**
 * POST /api/payhere/hash
 * Server-side checkout hash generation (PayHere Checkout API / JS SDK).
 *
 * Hash formula:
 * MD5(merchant_id + order_id + amount + currency + MD5(merchant_secret).toUpperCase()).toUpperCase()
 */
export async function POST(request: Request) {
  const config = getPayHereConfig()

  if (!isPayHereConfigured(config)) {
    return NextResponse.json(
      { error: "PayHere is not configured." },
      { status: 503 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const parsed = hashRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload.", details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { order_id, currency = "LKR" } = parsed.data
  let amountFormatted: string
  try {
    amountFormatted = formatAmount(parsed.data.amount)
  } catch {
    return NextResponse.json({ error: "Invalid amount." }, { status: 400 })
  }

  const hash = generateCheckoutHash(
    config.merchantId,
    order_id,
    amountFormatted,
    currency,
    config.merchantSecret
  )

  return NextResponse.json({ hash, amount: amountFormatted, currency })
}

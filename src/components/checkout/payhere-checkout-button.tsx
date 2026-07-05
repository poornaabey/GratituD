"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  formatPayHereAmountClient,
  getPayHereClientConfig,
  splitCustomerName,
  toPayHereOrderId,
} from "@/lib/payments/payhere-client"
import type { PayHerePayment } from "@/types/payhere"

export interface PayHereCheckoutSession {
  /** Primary order UUID (first in batch). */
  primaryOrderId: string
  /** All order UUIDs for success redirect. */
  orderIds: string[]
  amountLkrCents: number
  items: string
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  city: string
}

interface PayHereCheckoutButtonProps {
  session: PayHereCheckoutSession | null
  disabled?: boolean
  loading?: boolean
  onPayStart?: () => void
  onPayError?: (message: string) => void
  children?: React.ReactNode
  className?: string
}

async function fetchCheckoutHash(
  orderId: string,
  amount: string,
  currency = "LKR"
): Promise<string> {
  const res = await fetch("/api/payhere/hash", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_id: orderId, amount, currency }),
  })

  const data = (await res.json()) as { hash?: string; error?: string }
  if (!res.ok || !data.hash) {
    throw new Error(data.error ?? "Failed to generate payment hash.")
  }
  return data.hash
}

export function PayHereCheckoutButton({
  session,
  disabled,
  loading,
  onPayStart,
  onPayError,
  children,
  className,
}: PayHereCheckoutButtonProps) {
  const [paying, setPaying] = React.useState(false)

  const startPayment = async () => {
    if (!session) return

    const config = getPayHereClientConfig()
    if (!config.merchantId) {
      onPayError?.("PayHere merchant ID is not configured.")
      return
    }

    if (!window.payhere) {
      onPayError?.("PayHere SDK is still loading. Please try again.")
      return
    }

    setPaying(true)
    onPayStart?.()

    try {
      const payhereOrderId = toPayHereOrderId(session.primaryOrderId)
      const amount = formatPayHereAmountClient(session.amountLkrCents)
      const hash = await fetchCheckoutHash(payhereOrderId, amount)
      const { firstName, lastName } = splitCustomerName(session.customerName)

      const payment: PayHerePayment = {
        sandbox: config.sandbox,
        merchant_id: config.merchantId,
        notify_url: config.notifyUrl,
        order_id: payhereOrderId,
        items: session.items,
        amount,
        currency: "LKR",
        hash,
        first_name: firstName,
        last_name: lastName,
        email: session.customerEmail,
        phone: session.customerPhone,
        address: session.address,
        city: session.city,
        country: "Sri Lanka",
      }

      window.payhere.startPayment(payment)
    } catch (err) {
      onPayError?.(
        err instanceof Error ? err.message : "Could not start PayHere payment."
      )
    } finally {
      setPaying(false)
    }
  }

  return (
    <Button
      type="button"
      className={className}
      size="lg"
      disabled={disabled || loading || paying || !session}
      onClick={startPayment}
    >
      {paying || loading
        ? "Opening PayHere…"
        : (children ?? "Pay with PayHere")}
    </Button>
  )
}

async function waitForPayHereSdk(timeoutMs = 8000): Promise<boolean> {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    if (window.payhere) return true
    await new Promise((r) => setTimeout(r, 100))
  }
  return false
}

/** Imperative helper — call after placeOrder succeeds. */
export async function startPayHereCheckout(
  session: PayHereCheckoutSession,
  handlers?: {
    onError?: (message: string) => void
  }
): Promise<void> {
  const config = getPayHereClientConfig()
  if (!config.merchantId) {
    handlers?.onError?.("PayHere merchant ID is not configured.")
    return
  }

  const ready = await waitForPayHereSdk()
  if (!ready || !window.payhere) {
    handlers?.onError?.("PayHere SDK is still loading. Tap the button to retry.")
    return
  }

  try {
    const payhereOrderId = toPayHereOrderId(session.primaryOrderId)
    const amount = formatPayHereAmountClient(session.amountLkrCents)
    const hash = await fetchCheckoutHash(payhereOrderId, amount)
    const { firstName, lastName } = splitCustomerName(session.customerName)

    window.payhere.startPayment({
      sandbox: config.sandbox,
      merchant_id: config.merchantId,
      notify_url: config.notifyUrl,
      order_id: payhereOrderId,
      items: session.items,
      amount,
      currency: "LKR",
      hash,
      first_name: firstName,
      last_name: lastName,
      email: session.customerEmail,
      phone: session.customerPhone,
      address: session.address,
      city: session.city,
      country: "Sri Lanka",
    })
  } catch (err) {
    handlers?.onError?.(
      err instanceof Error ? err.message : "Could not start PayHere payment."
    )
  }
}

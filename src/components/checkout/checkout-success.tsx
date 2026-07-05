"use client"

import * as React from "react"
import Link from "next/link"
import { CheckCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"
import { markOrdersPaid } from "@/lib/actions/checkout"
import { useCartStore } from "@/store/cart-store"

export function CheckoutSuccess({
  orderIds,
  isDemo,
}: {
  orderIds: string[]
  isDemo: boolean
}) {
  const clearCart = useCartStore((s) => s.clear)
  const [done, setDone] = React.useState(false)

  React.useEffect(() => {
    if (done) return
    ;(async () => {
      if (isDemo && orderIds.length) {
        await markOrdersPaid(orderIds, "demo")
      }
      clearCart()
      setDone(true)
    })()
  }, [isDemo, orderIds, clearCart, done])

  return (
    <Container className="py-16 text-center">
      <CheckCircleIcon className="mx-auto size-14 text-gold" />
      <h1 className="mt-6 font-heading text-3xl font-semibold">
        Thank you for your order!
      </h1>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">
        {isDemo
          ? "Demo mode — payment skipped. Your order has been saved and marked as paid for testing."
          : "Payment received. We're curating your gift box and will deliver on your chosen date."}
      </p>
      {orderIds.length > 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          Order ref: {orderIds[0].slice(0, 8).toUpperCase()}
        </p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button render={<Link href="/build" />}>Build another box</Button>
        <Button variant="outline" render={<Link href="/account/orders" />}>
          View my orders
        </Button>
      </div>
    </Container>
  )
}

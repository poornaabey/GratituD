"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { addDays, format } from "date-fns"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Container } from "@/components/layout/container"
import {
  PayHereCheckoutButton,
  startPayHereCheckout,
  type PayHereCheckoutSession,
} from "@/components/checkout/payhere-checkout-button"
import { PayHereScriptProvider } from "@/components/checkout/payhere-script"
import { formatLKR } from "@/lib/constants"
import { placeOrder } from "@/lib/actions/checkout"
import { useCartStore } from "@/store/cart-store"
import type { DeliveryZone } from "@/types/db"

function CheckoutFormInner({ zones }: { zones: DeliveryZone[] }) {
  const router = useRouter()
  const boxes = useCartStore((s) => s.boxes)
  const clearCart = useCartStore((s) => s.clear)
  const [loading, setLoading] = React.useState(false)
  const [zoneId, setZoneId] = React.useState(zones[0]?.id ?? "")
  const [paySession, setPaySession] = React.useState<PayHereCheckoutSession | null>(
    null
  )
  const pendingOrdersRef = React.useRef<string[]>([])

  const isSandbox =
    (process.env.NEXT_PUBLIC_PAYHERE_ENV ?? "sandbox") !== "production"

  const subtotal = boxes.reduce((s, b) => s + b.subtotalLkr, 0)
  const zone = zones.find((z) => z.id === zoneId)
  const deliveryFee = zone?.fee_lkr ?? 0
  const total = subtotal + deliveryFee

  const minDate = format(addDays(new Date(), 2), "yyyy-MM-dd")

  const buildSession = (
    fd: FormData,
    result: {
      primaryOrderId: string
      orderIds: string[]
      amountLkrCents: number
      itemsDescription: string
    }
  ): PayHereCheckoutSession => ({
    primaryOrderId: result.primaryOrderId,
    orderIds: result.orderIds,
    amountLkrCents: result.amountLkrCents,
    items: result.itemsDescription,
    customerName: String(fd.get("contactName")),
    customerEmail: String(fd.get("contactEmail")),
    customerPhone: String(fd.get("contactPhone")),
    address: String(fd.get("addressLine1")),
    city: String(fd.get("city")),
  })

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    sandboxDemo = false
  ) => {
    e.preventDefault()
    if (!boxes.length) {
      toast.error("Your cart is empty.")
      router.push("/cart")
      return
    }

    const fd = new FormData(e.currentTarget)
    setLoading(true)
    setPaySession(null)

    const result = await placeOrder(
      {
        boxes,
        contactName: String(fd.get("contactName")),
        contactEmail: String(fd.get("contactEmail")),
        contactPhone: String(fd.get("contactPhone")),
        addressLine1: String(fd.get("addressLine1")),
        addressLine2: String(fd.get("addressLine2") || "") || undefined,
        city: String(fd.get("city")),
        zoneId,
        deliveryDate: String(fd.get("deliveryDate")),
        deliveryNotes: String(fd.get("deliveryNotes") || "") || undefined,
      },
      { sandboxDemo }
    )

    setLoading(false)

    if (!result.ok) {
      toast.error(result.error)
      return
    }

    if (result.data.redirectUrl) {
      window.location.href = result.data.redirectUrl
      return
    }

    pendingOrdersRef.current = result.data.orderIds
    const session = buildSession(fd, result.data)
    setPaySession(session)

    // Open PayHere modal once SDK + hash are ready
    void startPayHereCheckout(session, {
      onError: (msg) => toast.error(msg),
    })
  }

  if (!boxes.length) {
    return (
      <Container className="py-16 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Button className="mt-4" onClick={() => router.push("/build")}>
          Build a gift box
        </Button>
      </Container>
    )
  }

  return (
    <PayHereScriptProvider
      handlers={{
        onCompleted: () => {
          clearCart()
          const orders = pendingOrdersRef.current.join(",")
          router.push(`/checkout/success?orders=${orders}`)
        },
        onDismissed: () => {
          toast.info("Payment window closed. Your order is saved — try paying again.")
        },
        onError: (error) => {
          router.push(`/checkout/error?reason=${encodeURIComponent(error)}`)
        },
      }}
    >
      <Container className="py-8 md:py-12">
        <h1 className="font-heading text-3xl font-semibold">Checkout</h1>
        <p className="mt-1 text-muted-foreground">
          Delivery across Colombo &amp; suburbs
        </p>

        <form
          onSubmit={(e) => handleSubmit(e, false)}
          className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]"
        >
          <div className="space-y-6">
            <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
              <h2 className="font-heading text-lg font-medium">Contact</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="contactName">Full name</Label>
                  <Input id="contactName" name="contactName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone</Label>
                  <Input id="contactPhone" name="contactPhone" type="tel" required />
                </div>
              </div>
            </section>

            <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
              <h2 className="font-heading text-lg font-medium">Delivery</h2>
              <div className="space-y-2">
                <Label htmlFor="addressLine1">Address line 1</Label>
                <Input id="addressLine1" name="addressLine1" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressLine2">Address line 2 (optional)</Label>
                <Input id="addressLine2" name="addressLine2" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" defaultValue="Colombo" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zoneId">Delivery area</Label>
                  <select
                    id="zoneId"
                    name="zoneId"
                    value={zoneId}
                    onChange={(e) => setZoneId(e.target.value)}
                    className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    required
                  >
                    {zones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name} (+{formatLKR(z.fee_lkr)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryDate">Delivery date</Label>
                <Input
                  id="deliveryDate"
                  name="deliveryDate"
                  type="date"
                  min={minDate}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 2 days from today for hand-curation and delivery.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryNotes">Delivery notes (optional)</Label>
                <Textarea id="deliveryNotes" name="deliveryNotes" rows={2} />
              </div>
            </section>
          </div>

          <aside className="h-fit space-y-4 rounded-2xl border border-gold/40 bg-accent/30 p-5 lg:sticky lg:top-24">
            <h2 className="font-heading text-lg font-medium">Order summary</h2>
            <p className="text-sm text-muted-foreground">
              {boxes.length} gift box{boxes.length === 1 ? "" : "es"}
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums">{formatLKR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className="tabular-nums">{formatLKR(deliveryFee)}</span>
              </div>
            </div>
            <div className="flex justify-between border-t border-border pt-3 font-heading text-lg font-semibold">
              <span>Total</span>
              <span className="tabular-nums">{formatLKR(total)}</span>
            </div>

            {!paySession ? (
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Saving order…" : "Place order — pay with PayHere"}
              </Button>
            ) : (
              <PayHereCheckoutButton
                session={paySession}
                loading={loading}
                className="w-full"
                onPayError={(msg) => toast.error(msg)}
              >
                Open PayHere payment
              </PayHereCheckoutButton>
            )}

            {isSandbox && !paySession && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                size="lg"
                disabled={loading}
                onClick={(e) => {
                  const form = e.currentTarget.closest("form")
                  if (form) {
                    handleSubmit(
                      {
                        preventDefault: () => {},
                        currentTarget: form,
                      } as React.FormEvent<HTMLFormElement>,
                      true
                    )
                  }
                }}
              >
                Skip PayHere (sandbox demo)
              </Button>
            )}

            <p className="text-center text-xs text-muted-foreground">
              Guest checkout supported.{" "}
              <a href="/auth" className="underline-offset-4 hover:underline">
                Sign in
              </a>{" "}
              to save occasions.
            </p>
          </aside>
        </form>
      </Container>
    </PayHereScriptProvider>
  )
}

export function CheckoutForm({ zones }: { zones: DeliveryZone[] }) {
  return <CheckoutFormInner zones={zones} />
}

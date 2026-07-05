"use client"

import Link from "next/link"
import { Trash2Icon, ShoppingBagIcon, GiftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"
import { formatLKR } from "@/lib/constants"
import { useCartStore } from "@/store/cart-store"

export function CartView() {
  const boxes = useCartStore((s) => s.boxes)
  const removeBox = useCartStore((s) => s.removeBox)
  const subtotal = boxes.reduce((sum, b) => sum + b.subtotalLkr, 0)

  if (boxes.length === 0) {
    return (
      <Container className="py-16 text-center">
        <ShoppingBagIcon className="mx-auto size-12 text-muted-foreground/50" />
        <h1 className="mt-4 font-heading text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">
          Build a bespoke gift box and add it here when you&apos;re ready.
        </p>
        <Button className="mt-6" render={<Link href="/build" />}>
          <GiftIcon className="size-4" />
          Build a Gift Box
        </Button>
      </Container>
    )
  }

  return (
    <Container className="py-8 md:py-12">
      <h1 className="font-heading text-3xl font-semibold text-foreground">Your cart</h1>
      <p className="mt-1 text-muted-foreground">
        {boxes.length} gift box{boxes.length === 1 ? "" : "es"} ready to order
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <ul className="space-y-4">
          {boxes.map((box) => (
            <li
              key={box.id}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-heading text-lg font-medium">
                    {box.packaging.name}
                  </h2>
                  {box.recipientName && (
                    <p className="text-sm text-muted-foreground">
                      For {box.recipientName}
                    </p>
                  )}
                  <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                    {box.items.map((line) => (
                      <li key={line.product.id}>
                        {line.quantity} × {line.product.name}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="font-medium tabular-nums">
                    {formatLKR(box.subtotalLkr)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Remove box"
                    onClick={() => removeBox(box.id)}
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-24">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium tabular-nums">{formatLKR(subtotal)}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Delivery fee calculated at checkout based on your area.
          </p>
          <Button className="mt-5 w-full" size="lg" render={<Link href="/checkout" />}>
            Proceed to checkout
          </Button>
          <Button
            variant="ghost"
            className="mt-2 w-full"
            render={<Link href="/build" />}
          >
            Add another box
          </Button>
        </aside>
      </div>
    </Container>
  )
}

"use client"

import Link from "next/link"
import { ShoppingBagIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/store/cart-store"

export function CartButton() {
  const count = useCartStore((s) => s.boxes.length)

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Cart${count ? `, ${count} items` : ""}`}
      className="relative"
      render={<Link href="/cart" />}
    >
      <ShoppingBagIcon className="size-4" />
      {count > 0 && (
        <Badge className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-gold p-0 text-[10px] text-gold-foreground">
          {count}
        </Badge>
      )}
    </Button>
  )
}

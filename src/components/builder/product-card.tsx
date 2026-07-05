"use client"

import { MinusIcon, PlusIcon, GiftIcon } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { formatLKR } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { categoryAccent } from "@/lib/catalog"
import { useBuilderStore } from "@/store/builder-store"
import type { Product } from "@/types/db"

export function ProductCard({
  product,
  categorySlug,
}: {
  product: Product
  categorySlug: string
}) {
  const line = useBuilderStore((s) => s.items[product.id])
  const addItem = useBuilderStore((s) => s.addItem)
  const incrementItem = useBuilderStore((s) => s.incrementItem)
  const decrementItem = useBuilderStore((s) => s.decrementItem)

  const qty = line?.quantity ?? 0
  const accent = categoryAccent[categorySlug] ?? "bg-secondary"

  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all",
        qty > 0 ? "border-gold/60 shadow-sm" : "border-border hover:shadow-md"
      )}
    >
      <div className={cn("relative flex aspect-[4/3] items-center justify-center", accent)}>
        <GiftIcon className="size-9 text-foreground/50" />
        {qty > 0 && (
          <Badge className="absolute right-2 top-2 bg-gold text-gold-foreground">
            {qty} in box
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1 space-y-1">
          <h3 className="font-heading text-base font-medium leading-tight text-foreground">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium text-foreground">
            {formatLKR(product.price_lkr)}
          </span>
          <span className="text-xs text-muted-foreground">
            {product.capacity} slot{product.capacity === 1 ? "" : "s"}
          </span>
        </div>

        {qty === 0 ? (
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => {
              const res = addItem(product)
              if (!res.ok && res.reason) toast.error(res.reason)
            }}
          >
            <PlusIcon className="size-4" />
            Add to box
          </Button>
        ) : (
          <div className="flex items-center justify-between gap-2 rounded-lg border border-border p-1">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Remove one"
              onClick={() => decrementItem(product.id)}
            >
              <MinusIcon className="size-4" />
            </Button>
            <span className="min-w-8 text-center text-sm font-medium tabular-nums">
              {qty}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Add one"
              onClick={() => {
                const res = incrementItem(product.id)
                if (!res.ok && res.reason) toast.error(res.reason)
              }}
            >
              <PlusIcon className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

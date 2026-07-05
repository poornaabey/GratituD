"use client"

import { GiftIcon } from "lucide-react"

import { formatLKR } from "@/lib/constants"
import { Separator } from "@/components/ui/separator"
import { CapacityMeter } from "@/components/builder/capacity-meter"
import { useBuilderStore } from "@/store/builder-store"
import { useBuilderTotals } from "@/hooks/use-builder-totals"

export function BoxSummary() {
  const packaging = useBuilderStore((s) => s.packaging)
  const items = useBuilderStore((s) => s.items)
  const { subtotal, count, itemsTotal, packagingPrice, cardPrice } =
    useBuilderTotals()

  const lines = Object.values(items)

  return (
    <aside className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <GiftIcon className="size-5" />
        </div>
        <div>
          <p className="font-heading text-base font-medium text-foreground">
            Your box
          </p>
          <p className="text-xs text-muted-foreground">
            {packaging ? packaging.name : "No box chosen yet"}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <CapacityMeter />
      </div>

      <Separator className="my-5" />

      {lines.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Items you add will appear here.
        </p>
      ) : (
        <ul className="max-h-56 space-y-2 overflow-y-auto pr-1">
          {lines.map(({ product, quantity }) => (
            <li
              key={product.id}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <span className="truncate text-muted-foreground">
                {quantity} × {product.name}
              </span>
              <span className="shrink-0 text-foreground tabular-nums">
                {formatLKR(product.price_lkr * quantity)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <Separator className="my-5" />

      <div className="space-y-1.5 text-sm">
        <Row label={`Items (${count})`} value={formatLKR(itemsTotal)} />
        <Row label="Packaging" value={formatLKR(packagingPrice)} />
        <Row label="Card" value={formatLKR(cardPrice)} />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="font-heading text-base font-semibold text-foreground">
          Subtotal
        </span>
        <span className="font-heading text-base font-semibold text-foreground tabular-nums">
          {formatLKR(subtotal)}
        </span>
      </div>
    </aside>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground tabular-nums">{value}</span>
    </div>
  )
}

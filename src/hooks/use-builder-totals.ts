"use client"

import {
  useBuilderStore,
  usedCapacity,
  itemsSubtotal,
  totalItemCount,
} from "@/store/builder-store"

export function useBuilderTotals() {
  const items = useBuilderStore((s) => s.items)
  const packaging = useBuilderStore((s) => s.packaging)
  const card = useBuilderStore((s) => s.greetingCard)

  const used = usedCapacity(items)
  const capacity = packaging?.capacity ?? 0
  const itemsTotal = itemsSubtotal(items)
  const packagingPrice = packaging?.price_lkr ?? 0
  const cardPrice = card?.price_lkr ?? 0
  const subtotal = itemsTotal + packagingPrice + cardPrice

  return {
    used,
    capacity,
    remaining: Math.max(capacity - used, 0),
    fillPct: capacity > 0 ? Math.min((used / capacity) * 100, 100) : 0,
    isFull: capacity > 0 && used >= capacity,
    itemsTotal,
    packagingPrice,
    cardPrice,
    subtotal,
    count: totalItemCount(items),
  }
}

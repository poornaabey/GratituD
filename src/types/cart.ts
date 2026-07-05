import type { GreetingCard, PackagingOption, Product } from "@/types/db"

export interface CartLineItem {
  product: Product
  quantity: number
}

/** Serializable snapshot of a completed gift-box build. */
export interface CartBox {
  id: string
  packaging: PackagingOption
  items: CartLineItem[]
  greetingCard: GreetingCard | null
  recipientName: string
  giftNote: string
  subtotalLkr: number
}

export function boxSubtotal(box: Pick<CartBox, "items" | "packaging" | "greetingCard">): number {
  const itemsTotal = box.items.reduce(
    (sum, line) => sum + line.product.price_lkr * line.quantity,
    0
  )
  const packaging = box.packaging.price_lkr
  const card = box.greetingCard?.price_lkr ?? 0
  return itemsTotal + packaging + card
}

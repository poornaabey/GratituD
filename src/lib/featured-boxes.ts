import type { FeaturedBox } from "@/types/db"

/** Placeholder accent per box slug — swap for image_url when photography is ready. */
export const featuredBoxAccent: Record<string, string> = {
  "comfort-box": "bg-blush/30",
  "pamper-box": "bg-sage/25",
  "celebration-box": "bg-accent",
  "him-box": "bg-secondary",
}

export function featuredBoxAccentClass(slug: string): string {
  return featuredBoxAccent[slug] ?? "bg-secondary/60"
}

/** Fallback when Supabase has no rows (local dev without seed). */
export const FEATURED_BOX_FALLBACK: Pick<
  FeaturedBox,
  "id" | "name" | "slug" | "description" | "base_price_lkr" | "image_url"
>[] = [
  {
    id: "fallback-comfort",
    name: "The Comfort Box",
    slug: "comfort-box",
    description: "Candle, tea sampler & chocolates for a cosy pick-me-up.",
    base_price_lkr: 650000,
    image_url: "featured/comfort-box.jpg",
  },
  {
    id: "fallback-pamper",
    name: "The Pamper Box",
    slug: "pamper-box",
    description: "Rose mist, body butter & a soy candle for self-care.",
    base_price_lkr: 720000,
    image_url: "featured/pamper-box.jpg",
  },
  {
    id: "fallback-celebration",
    name: "The Celebration Box",
    slug: "celebration-box",
    description: "Preserved rose, truffles & a keepsake mug.",
    base_price_lkr: 890000,
    image_url: "featured/celebration-box.jpg",
  },
  {
    id: "fallback-him",
    name: "The Him Box",
    slug: "him-box",
    description: "Bluetooth speaker, dark chocolate & a travel tumbler.",
    base_price_lkr: 1150000,
    image_url: "featured/him-box.jpg",
  },
]

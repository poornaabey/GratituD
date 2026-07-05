import type { Metadata } from "next"
import Link from "next/link"
import { GiftIcon } from "lucide-react"

import { FeaturedBoxCard } from "@/components/shop/featured-box-card"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"
import { getFeaturedBoxes } from "@/lib/data/catalog"
import { FEATURED_BOX_FALLBACK } from "@/lib/featured-boxes"

export const metadata: Metadata = {
  title: "Shop Gift Boxes",
  description:
    "Browse pre-curated premium gift boxes — ready to personalize and deliver across Colombo.",
}

export default async function ShopPage() {
  let boxes = await getFeaturedBoxes()

  if (boxes.length === 0) {
    boxes = FEATURED_BOX_FALLBACK.map((box) => ({
      ...box,
      image_url: null,
      is_active: true,
      created_at: new Date(0).toISOString(),
    }))
  }

  return (
    <Container className="py-10 md:py-14">
      <div className="max-w-2xl">
        <p className="font-heading text-sm font-medium tracking-wider text-gold uppercase">
          Shop
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold text-foreground sm:text-4xl">
          Pre-curated gift boxes
        </h1>
        <p className="mt-4 text-muted-foreground">
          Thoughtfully assembled favourites for when you&apos;re short on time.
          Each box can be personalized with a note before checkout.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {boxes.map((box) => (
          <FeaturedBoxCard key={box.id} box={box} />
        ))}
      </div>

      <div className="mt-16 rounded-2xl border border-border bg-secondary/40 p-8 text-center md:p-10">
        <GiftIcon className="mx-auto size-10 text-gold" />
        <h2 className="mt-4 font-heading text-xl font-semibold">
          Want something unique?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Build your own box from scratch — pick packaging, curate every item, and
          add a handwritten-style note.
        </p>
        <Button className="mt-6" render={<Link href="/build" />}>
          Build a custom box
        </Button>
      </div>
    </Container>
  )
}

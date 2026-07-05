import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { FeaturedBoxCard } from "@/components/shop/featured-box-card"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"
import { FEATURED_BOX_FALLBACK } from "@/lib/featured-boxes"
import type { FeaturedBox } from "@/types/db"

interface FeaturedBoxesProps {
  boxes?: FeaturedBox[]
}

export function FeaturedBoxes({ boxes = [] }: FeaturedBoxesProps) {
  const display =
    boxes.length > 0
      ? boxes
      : FEATURED_BOX_FALLBACK.map((box) => ({
          ...box,
          is_active: true,
          created_at: new Date(0).toISOString(),
        }))

  return (
    <section id="featured" className="scroll-mt-20 bg-secondary/40 py-20 md:py-24">
      <Container>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="font-heading text-sm font-medium tracking-wider text-gold uppercase">
              In a hurry?
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-foreground sm:text-4xl">
              Pre-curated gift boxes
            </h2>
            <p className="mt-4 text-muted-foreground">
              Thoughtfully assembled favourites, ready to personalize and send.
            </p>
          </div>
          <Button variant="outline" render={<Link href="/boxes" />}>
            View all
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {display.slice(0, 4).map((box) => (
            <FeaturedBoxCard key={box.id} box={box} />
          ))}
        </div>
      </Container>
    </section>
  )
}

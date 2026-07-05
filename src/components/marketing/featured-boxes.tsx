import Link from "next/link"
import { ArrowRightIcon, GiftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Container } from "@/components/layout/container"
import { formatLKR } from "@/lib/constants"

// Static preview data for Phase 3. Wired to Supabase `featured_boxes` in Phase 5.
const FEATURED = [
  {
    slug: "comfort-box",
    name: "The Comfort Box",
    description: "Candle, tea sampler & chocolates for a cosy pick-me-up.",
    price: 650000,
    accent: "bg-blush/30",
  },
  {
    slug: "pamper-box",
    name: "The Pamper Box",
    description: "Rose mist, body butter & a soy candle for self-care.",
    price: 720000,
    accent: "bg-sage/25",
  },
  {
    slug: "celebration-box",
    name: "The Celebration Box",
    description: "Preserved rose, truffles & a keepsake mug.",
    price: 890000,
    accent: "bg-accent",
  },
  {
    slug: "him-box",
    name: "The Him Box",
    description: "Bluetooth speaker, dark chocolate & a travel tumbler.",
    price: 1150000,
    accent: "bg-secondary",
  },
] as const

export function FeaturedBoxes() {
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
          {FEATURED.map((box) => (
            <Card
              key={box.slug}
              className="overflow-hidden pt-0 transition-shadow hover:shadow-lg"
            >
              <div
                className={`flex aspect-[4/3] items-center justify-center ${box.accent}`}
              >
                <GiftIcon className="size-10 text-foreground/70" />
              </div>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-heading text-lg font-medium text-foreground">
                    {box.name}
                  </h3>
                  <Badge variant="secondary">{formatLKR(box.price)}</Badge>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {box.description}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="secondary"
                  className="w-full"
                  render={<Link href={`/boxes/${box.slug}`} />}
                >
                  View box
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}

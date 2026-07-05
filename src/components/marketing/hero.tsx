import Link from "next/link"
import { ArrowRightIcon, GiftIcon, StarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Container } from "@/components/layout/container"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gratitud-wash">
      <Container className="grid items-center gap-12 py-20 md:grid-cols-2 md:py-28">
        <div className="space-y-7">
          <Badge
            variant="outline"
            className="border-gold/40 bg-background/60 text-gold-foreground"
          >
            <StarIcon className="fill-gold text-gold" />
            Curated in Colombo · Delivered with love
          </Badge>

          <h1 className="font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Gifts as thoughtful
            <br />
            as the person
            <span className="text-gold"> you love.</span>
          </h1>

          <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
            Hand-build a premium, personalized gift box — choose the packaging,
            curate every item, add a heartfelt note, and we deliver it beautifully
            across Colombo and its suburbs.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" render={<Link href="/build" />}>
              <GiftIcon className="size-4" />
              Build Your Gift Box
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/boxes" />}
            >
              Shop ready-made
              <ArrowRightIcon className="size-4" />
            </Button>
          </div>

          <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className="size-4 fill-gold text-gold" />
              ))}
            </div>
            <span>Loved by 500+ gifters</span>
          </div>
        </div>

        {/* Visual placeholder — swap for hero product photography */}
        <div className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border/60 bg-card shadow-xl">
            <div className="absolute inset-0 bg-gratitud-wash opacity-80" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
              <div className="flex size-24 items-center justify-center rounded-2xl bg-background/70 shadow-lg backdrop-blur">
                <GiftIcon className="size-12 text-gold" />
              </div>
              <p className="font-heading text-2xl font-medium text-foreground">
                Your box, your way
              </p>
              <p className="max-w-[16rem] text-sm text-muted-foreground">
                Hero photography of a signature GratituD box goes here.
              </p>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-border/60 bg-card px-5 py-4 shadow-lg sm:block">
            <p className="font-heading text-xl font-semibold text-foreground">
              4 easy steps
            </p>
            <p className="text-xs text-muted-foreground">
              from empty box to delivered
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}

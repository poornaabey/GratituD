import { QuoteIcon, StarIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Container } from "@/components/layout/container"

const TESTIMONIALS = [
  {
    quote:
      "The box arrived looking absolutely stunning. My mum cried happy tears — the handwritten note was such a lovely touch.",
    name: "Nethmi P.",
    location: "Colombo 05",
  },
  {
    quote:
      "Ordered from abroad for my best friend's birthday. Effortless to build and delivered right on the day. Highly recommend.",
    name: "Dinuka R.",
    location: "Nugegoda",
  },
  {
    quote:
      "Premium feel from start to finish. The packaging alone made it feel like a luxury gift. Will be back for the holidays.",
    name: "Ayesha F.",
    location: "Dehiwala",
  },
] as const

export function Testimonials() {
  return (
    <section className="py-20 md:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-heading text-sm font-medium tracking-wider text-gold uppercase">
            Kind words
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            Gifts that leave an impression
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} className="relative">
              <CardContent className="space-y-4">
                <QuoteIcon className="size-8 text-gold/40" />
                <p className="text-sm leading-relaxed text-foreground">
                  “{t.quote}”
                </p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="size-4 fill-gold text-gold" />
                  ))}
                </div>
                <div>
                  <p className="font-heading font-medium text-foreground">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}

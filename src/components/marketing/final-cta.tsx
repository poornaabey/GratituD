import Link from "next/link"
import { GiftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"

export function FinalCta() {
  return (
    <section className="pb-8">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-charcoal px-8 py-16 text-center md:py-20">
          <div className="absolute inset-0 bg-gratitud-wash opacity-30" />
          <div className="relative mx-auto max-w-2xl space-y-6">
            <h2 className="font-heading text-3xl font-semibold text-cream sm:text-4xl">
              Ready to make someone&apos;s day?
            </h2>
            <p className="text-cream/70">
              Build a one-of-a-kind gift box in minutes. Delivered beautifully,
              across Colombo and its suburbs.
            </p>
            <Button size="lg" render={<Link href="/build" />}>
              <GiftIcon className="size-4" />
              Start Building
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}

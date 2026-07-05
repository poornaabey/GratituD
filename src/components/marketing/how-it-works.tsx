import { BoxesIcon, PackageIcon, PenLineIcon, TruckIcon } from "lucide-react"

import { Container } from "@/components/layout/container"

const STEPS = [
  {
    icon: PackageIcon,
    title: "Choose your box",
    description:
      "Pick a size, colour and wrapping style — from a petite keepsake to a luxe heritage trunk.",
  },
  {
    icon: BoxesIcon,
    title: "Add your items",
    description:
      "Fill it with chocolates, candles, skincare, tech and more. Watch the capacity meter fill up.",
  },
  {
    icon: PenLineIcon,
    title: "Personalize it",
    description:
      "Add the recipient's name, choose a greeting card and write a handwritten-style note.",
  },
  {
    icon: TruckIcon,
    title: "We deliver",
    description:
      "Pick a delivery date and we'll bring your gift, beautifully packed, across Colombo & suburbs.",
  },
] as const

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-20 md:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-heading text-sm font-medium tracking-wider text-gold uppercase">
            How it works
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            Four steps to the perfect gift
          </h2>
          <p className="mt-4 text-muted-foreground">
            Designed to feel effortless — build something special in minutes.
          </p>
        </div>

        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="group relative rounded-2xl border border-border/60 bg-card p-6 transition-shadow hover:shadow-md"
            >
              <span className="font-heading text-sm font-semibold text-gold">
                Step {i + 1}
              </span>
              <div className="mt-4 flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <step.icon className="size-6" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-medium text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}

"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeftIcon, ArrowRightIcon, ShoppingBagIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"
import { StepIndicator } from "@/components/builder/step-indicator"
import { BoxSummary } from "@/components/builder/box-summary"
import { PackagingStep } from "@/components/builder/steps/packaging-step"
import { ItemsStep } from "@/components/builder/steps/items-step"
import { PersonalizeStep } from "@/components/builder/steps/personalize-step"
import { ReviewStep } from "@/components/builder/steps/review-step"
import { BuilderCatalogProvider } from "@/components/builder/builder-catalog-context"
import type { BuilderCatalog } from "@/lib/data/catalog"
import { useBuilderStore } from "@/store/builder-store"
import { useCartStore } from "@/store/cart-store"
import type { CartBox } from "@/types/cart"
import { useBuilderTotals } from "@/hooks/use-builder-totals"
import { BUILDER_STEPS } from "@/lib/constants"
import { formatLKR } from "@/lib/constants"

const stepComponents = {
  packaging: PackagingStep,
  items: ItemsStep,
  personalize: PersonalizeStep,
  review: ReviewStep,
} as const

export function BuilderWizard({ catalog }: { catalog: BuilderCatalog }) {
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const currentStep = useBuilderStore((s) => s.currentStep)
  const setStep = useBuilderStore((s) => s.setStep)
  const next = useBuilderStore((s) => s.next)
  const prev = useBuilderStore((s) => s.prev)

  const packaging = useBuilderStore((s) => s.packaging)
  const recipientName = useBuilderStore((s) => s.recipientName)
  const reset = useBuilderStore((s) => s.reset)
  const addToCart = useCartStore((s) => s.addBox)
  const { count, subtotal } = useBuilderTotals()

  const currentIndex = BUILDER_STEPS.findIndex((s) => s.id === currentStep)
  const isFirst = currentIndex === 0
  const isLast = currentIndex === BUILDER_STEPS.length - 1

  const validity: Record<string, { ok: boolean; hint: string }> = {
    packaging: { ok: !!packaging, hint: "Choose a box to continue." },
    items: { ok: count > 0, hint: "Add at least one item to continue." },
    personalize: {
      ok: recipientName.trim().length > 0,
      hint: "Add the recipient's name to continue.",
    },
    review: { ok: true, hint: "" },
  }
  const canProceed = validity[currentStep].ok

  const handleNext = () => {
    if (!canProceed) {
      toast.error(validity[currentStep].hint)
      return
    }
    next()
  }

  const handleCheckout = () => {
    const state = useBuilderStore.getState()
    if (!state.packaging || count === 0) {
      toast.error("Complete your box before adding to cart.")
      return
    }

    const box: CartBox = {
      id: crypto.randomUUID(),
      packaging: state.packaging,
      items: Object.values(state.items),
      greetingCard: state.greetingCard,
      recipientName: state.recipientName,
      giftNote: state.giftNote,
      subtotalLkr: subtotal,
    }

    addToCart(box)
    reset()
    toast.success("Added to cart!")
    router.push("/cart")
  }

  if (!mounted) {
    return (
      <Container className="py-12">
        <div className="h-96 animate-pulse rounded-2xl bg-muted" />
      </Container>
    )
  }

  const StepComponent = stepComponents[currentStep]

  return (
    <BuilderCatalogProvider catalog={catalog}>
      <Container className="py-8 md:py-12">
      <div className="mx-auto mb-8 max-w-3xl">
        <StepIndicator current={currentStep} onStepClick={setStep} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <StepComponent />
            </motion.div>
          </AnimatePresence>

          {/* Desktop nav */}
          <div className="mt-10 hidden items-center justify-between border-t border-border pt-6 sm:flex">
            <Button
              variant="ghost"
              onClick={prev}
              disabled={isFirst}
              className={isFirst ? "invisible" : ""}
            >
              <ArrowLeftIcon className="size-4" />
              Back
            </Button>

            {isLast ? (
              <Button size="lg" onClick={handleCheckout}>
                <ShoppingBagIcon className="size-4" />
                Add to Cart
              </Button>
            ) : (
              <Button size="lg" onClick={handleNext} disabled={!canProceed}>
                Continue
                <ArrowRightIcon className="size-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-24">
            <BoxSummary />
          </div>
        </div>
      </div>

      {/* Mobile sticky action bar */}
      <div className="sticky bottom-0 z-30 -mx-5 mt-8 border-t border-border bg-background/95 px-5 py-3 backdrop-blur sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">
              {count} item{count === 1 ? "" : "s"}
            </p>
            <p className="font-heading text-base font-semibold text-foreground tabular-nums">
              {formatLKR(subtotal)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isFirst && (
              <Button variant="outline" size="icon" onClick={prev} aria-label="Back">
                <ArrowLeftIcon className="size-4" />
              </Button>
            )}
            {isLast ? (
              <Button onClick={handleCheckout}>
                <ShoppingBagIcon className="size-4" />
                Add to Cart
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!canProceed}>
                Continue
                <ArrowRightIcon className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Container>
    </BuilderCatalogProvider>
  )
}

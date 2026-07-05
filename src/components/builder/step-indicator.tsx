"use client"

import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { BUILDER_STEPS, type BuilderStepId } from "@/lib/constants"

export function StepIndicator({
  current,
  onStepClick,
}: {
  current: BuilderStepId
  onStepClick?: (step: BuilderStepId) => void
}) {
  const currentIndex = BUILDER_STEPS.findIndex((s) => s.id === current)

  return (
    <ol className="flex items-center">
      {BUILDER_STEPS.map((step, i) => {
        const isDone = i < currentIndex
        const isActive = i === currentIndex
        const clickable = isDone && onStepClick

        return (
          <li key={step.id} className="flex flex-1 items-center last:flex-none">
            <button
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onStepClick?.(step.id)}
              className={cn(
                "flex items-center gap-2.5",
                clickable && "cursor-pointer"
              )}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium transition-colors",
                  isActive &&
                    "border-gold bg-gold text-gold-foreground",
                  isDone && "border-gold bg-gold/15 text-gold",
                  !isActive && !isDone &&
                    "border-border bg-card text-muted-foreground"
                )}
              >
                {isDone ? <CheckIcon className="size-4" /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-sm font-medium sm:inline",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </button>

            {i < BUILDER_STEPS.length - 1 && (
              <span
                className={cn(
                  "mx-2 h-px flex-1 transition-colors sm:mx-4",
                  i < currentIndex ? "bg-gold/50" : "bg-border"
                )}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}

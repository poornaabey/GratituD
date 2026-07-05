"use client"

import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { useBuilderTotals } from "@/hooks/use-builder-totals"

export function CapacityMeter({ className }: { className?: string }) {
  const { used, capacity, fillPct, isFull, remaining } = useBuilderTotals()

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">Box capacity</span>
        <span
          className={cn(
            "tabular-nums",
            isFull ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {used} / {capacity || "—"} slots
        </span>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn(
            "h-full rounded-full",
            isFull ? "bg-destructive" : "bg-gold"
          )}
          initial={false}
          animate={{ width: `${fillPct}%` }}
          transition={{ type: "spring", stiffness: 220, damping: 30 }}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        {capacity === 0
          ? "Choose a box to see how much fits."
          : isFull
            ? "Your box is full — remove an item or size up."
            : `${remaining} slot${remaining === 1 ? "" : "s"} remaining`}
      </p>
    </div>
  )
}

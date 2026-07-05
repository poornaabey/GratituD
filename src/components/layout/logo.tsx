import Link from "next/link"

import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-baseline gap-0.5 font-heading text-2xl font-semibold tracking-tight",
        className
      )}
      aria-label="GratituD.lk home"
    >
      <span className="text-foreground">Gratitu</span>
      <span className="text-gold">D</span>
      <span className="text-muted-foreground text-sm font-normal">.lk</span>
    </Link>
  )
}

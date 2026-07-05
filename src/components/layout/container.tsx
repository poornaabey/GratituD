import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Centered, responsive content width used across the site.
 */
export function Container({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}
      {...props}
    />
  )
}

"use client"

import * as React from "react"
import Image from "next/image"
import {
  GiftIcon,
  PackageIcon,
  type LucideIcon,
} from "lucide-react"

import { resolveMediaUrl } from "@/lib/media"
import { cn } from "@/lib/utils"

const FALLBACK_ICONS = {
  gift: GiftIcon,
  package: PackageIcon,
} as const satisfies Record<string, LucideIcon>

export type CatalogFallbackIcon = keyof typeof FALLBACK_ICONS

interface CatalogImageProps {
  src: string | null | undefined
  alt: string
  /** Wrapper aspect ratio class, e.g. aspect-[4/3] */
  aspectClass?: string
  className?: string
  imageClassName?: string
  /** Shown when src is missing or fails to load */
  fallbackClassName?: string
  /** Icon key — must be serializable when passed from Server Components */
  fallbackIcon?: CatalogFallbackIcon
  iconClassName?: string
  priority?: boolean
  sizes?: string
}

export function CatalogImage({
  src,
  alt,
  aspectClass = "aspect-[4/3]",
  className,
  imageClassName,
  fallbackClassName = "bg-secondary/60",
  fallbackIcon = "gift",
  iconClassName = "size-9 text-foreground/50",
  priority = false,
  sizes = "(max-width: 768px) 50vw, 25vw",
}: CatalogImageProps) {
  const url = resolveMediaUrl(src)
  const [failed, setFailed] = React.useState(false)
  const FallbackIcon = FALLBACK_ICONS[fallbackIcon]

  React.useEffect(() => {
    setFailed(false)
  }, [url])

  if (!url || failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center",
          aspectClass,
          fallbackClassName,
          className
        )}
      >
        <FallbackIcon className={iconClassName} aria-hidden />
      </div>
    )
  }

  return (
    <div className={cn("relative overflow-hidden", aspectClass, className)}>
      <Image
        src={url}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-cover", imageClassName)}
        onError={() => setFailed(true)}
      />
    </div>
  )
}

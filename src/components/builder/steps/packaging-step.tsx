"use client"

import { CheckIcon, PackageIcon } from "lucide-react"

import { CatalogImage } from "@/components/ui/catalog-image"
import { cn } from "@/lib/utils"
import { formatLKR } from "@/lib/constants"
import { useBuilderCatalog } from "@/components/builder/builder-catalog-context"
import { useBuilderStore, usedCapacity } from "@/store/builder-store"
import { toast } from "sonner"

export function PackagingStep() {
  const { packagingOptions } = useBuilderCatalog()
  const selected = useBuilderStore((s) => s.packaging)
  const items = useBuilderStore((s) => s.items)
  const setPackaging = useBuilderStore((s) => s.setPackaging)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-semibold text-foreground">
          Choose your box
        </h2>
        <p className="mt-1 text-muted-foreground">
          Pick the size and style. You can always change it later.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {packagingOptions.map((pkg) => {
          const isSelected = selected?.id === pkg.id
          return (
            <button
              key={pkg.id}
              type="button"
              onClick={() => {
                if (usedCapacity(items) > pkg.capacity) {
                  toast.error(
                    `This box only holds ${pkg.capacity} slots — remove some items first.`
                  )
                  return
                }
                setPackaging(pkg)
              }}
              className={cn(
                "group relative flex flex-col gap-4 rounded-2xl border p-5 text-left transition-all",
                isSelected
                  ? "border-gold ring-2 ring-gold/40 bg-accent/40"
                  : "border-border bg-card hover:border-gold/50 hover:shadow-md"
              )}
            >
              {isSelected && (
                <span className="absolute right-4 top-4 z-10 flex size-6 items-center justify-center rounded-full bg-gold text-gold-foreground">
                  <CheckIcon className="size-4" />
                </span>
              )}

              <CatalogImage
                src={pkg.image_url}
                alt={pkg.name}
                aspectClass="aspect-[16/9] rounded-xl"
                fallbackClassName="rounded-xl bg-gratitud-wash"
                fallbackIcon={PackageIcon}
                iconClassName="size-10 text-foreground/60"
                sizes="(max-width: 640px) 100vw, 400px"
              />

              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-heading text-lg font-medium text-foreground">
                    {pkg.name}
                  </h3>
                  <span className="font-medium text-foreground">
                    {formatLKR(pkg.price_lkr)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {pkg.color} · {pkg.wrap_style}
                </p>
                <p className="text-sm text-gold">
                  Holds up to {pkg.capacity} items
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

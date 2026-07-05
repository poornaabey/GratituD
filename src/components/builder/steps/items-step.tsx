"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useBuilderCatalog } from "@/components/builder/builder-catalog-context"
import { ProductCard } from "@/components/builder/product-card"
import { CapacityMeter } from "@/components/builder/capacity-meter"

const ALL = "all"

export function ItemsStep() {
  const { categories, products } = useBuilderCatalog()
  const [activeCat, setActiveCat] = React.useState<string>(ALL)

  const filtered =
    activeCat === ALL
      ? products
      : products.filter((p) => p.category_id === activeCat)

  const catBySlug = (id: string | null) =>
    categories.find((c) => c.id === id)?.slug ?? "mugs"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-semibold text-foreground">
          Curate your items
        </h2>
        <p className="mt-1 text-muted-foreground">
          Tap to add treats to your box. Watch the capacity fill as you go.
        </p>
      </div>

      <div className="sticky top-16 z-10 -mx-1 rounded-xl border border-border/60 bg-background/90 p-4 backdrop-blur">
        <CapacityMeter />
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <FilterChip
          active={activeCat === ALL}
          onClick={() => setActiveCat(ALL)}
          label="All"
        />
        {categories.map((cat) => (
          <FilterChip
            key={cat.id}
            active={activeCat === cat.id}
            onClick={() => setActiveCat(cat.id)}
            label={cat.name}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            categorySlug={catBySlug(product.category_id)}
          />
        ))}
      </div>
    </div>
  )
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-gold bg-gold text-gold-foreground"
          : "border-border bg-card text-muted-foreground hover:border-gold/50 hover:text-foreground"
      )}
    >
      {label}
    </button>
  )
}

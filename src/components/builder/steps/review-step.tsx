"use client"

import { GiftIcon, PackageIcon, MailIcon } from "lucide-react"

import { formatLKR } from "@/lib/constants"
import { Separator } from "@/components/ui/separator"
import { useBuilderStore } from "@/store/builder-store"
import { useBuilderTotals } from "@/hooks/use-builder-totals"

export function ReviewStep() {
  const packaging = useBuilderStore((s) => s.packaging)
  const items = useBuilderStore((s) => s.items)
  const greetingCard = useBuilderStore((s) => s.greetingCard)
  const recipientName = useBuilderStore((s) => s.recipientName)
  const giftNote = useBuilderStore((s) => s.giftNote)

  const { itemsTotal, packagingPrice, cardPrice, subtotal, count } =
    useBuilderTotals()

  const lines = Object.values(items)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-semibold text-foreground">
          Review your gift
        </h2>
        <p className="mt-1 text-muted-foreground">
          Almost there — here&apos;s everything in your box.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        {/* Visual mockup */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border bg-gratitud-wash p-8 shadow-lg">
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="flex size-20 items-center justify-center rounded-2xl bg-background/70 shadow">
                <GiftIcon className="size-10 text-gold" />
              </div>
              <p className="font-heading text-xl font-medium text-foreground">
                {packaging?.name ?? "Your box"}
              </p>
              {recipientName && (
                <p className="font-script text-2xl text-charcoal">
                  For {recipientName}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                {count} item{count === 1 ? "" : "s"} inside
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-5">
          <section className="space-y-3 rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <PackageIcon className="size-4 text-gold" /> Packaging
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {packaging
                  ? `${packaging.name} · ${packaging.color}`
                  : "No box selected"}
              </span>
              <span className="text-foreground">
                {formatLKR(packagingPrice)}
              </span>
            </div>
          </section>

          <section className="space-y-3 rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <GiftIcon className="size-4 text-gold" /> Items ({count})
            </div>
            {lines.length === 0 ? (
              <p className="text-sm text-muted-foreground">No items added yet.</p>
            ) : (
              <ul className="space-y-2">
                {lines.map(({ product, quantity }) => (
                  <li
                    key={product.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">
                      {quantity} × {product.name}
                    </span>
                    <span className="text-foreground tabular-nums">
                      {formatLKR(product.price_lkr * quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="space-y-3 rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <MailIcon className="size-4 text-gold" /> Personalization
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                Card:{" "}
                <span className="text-foreground">
                  {greetingCard?.name ?? "None"}
                </span>
              </p>
              <p>
                Recipient:{" "}
                <span className="text-foreground">
                  {recipientName || "—"}
                </span>
              </p>
              {giftNote && (
                <p className="mt-2 rounded-lg bg-muted/60 p-3 font-script text-lg text-charcoal">
                  “{giftNote}”
                </p>
              )}
            </div>
          </section>

          {/* Price breakdown */}
          <section className="space-y-2 rounded-2xl border border-gold/40 bg-accent/30 p-5">
            <Row label="Items" value={formatLKR(itemsTotal)} />
            <Row label="Packaging" value={formatLKR(packagingPrice)} />
            <Row label="Greeting card" value={formatLKR(cardPrice)} />
            <p className="text-xs text-muted-foreground">
              Delivery calculated at checkout based on your area.
            </p>
            <Separator className="my-1" />
            <div className="flex items-center justify-between">
              <span className="font-heading text-lg font-semibold text-foreground">
                Subtotal
              </span>
              <span className="font-heading text-lg font-semibold text-foreground tabular-nums">
                {formatLKR(subtotal)}
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground tabular-nums">{value}</span>
    </div>
  )
}

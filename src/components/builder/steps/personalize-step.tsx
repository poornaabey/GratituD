"use client"

import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { formatLKR } from "@/lib/constants"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useBuilderCatalog } from "@/components/builder/builder-catalog-context"
import { useBuilderStore } from "@/store/builder-store"

const NOTE_MAX = 250

export function PersonalizeStep() {
  const { greetingCards } = useBuilderCatalog()
  const recipientName = useBuilderStore((s) => s.recipientName)
  const giftNote = useBuilderStore((s) => s.giftNote)
  const greetingCard = useBuilderStore((s) => s.greetingCard)
  const setRecipientName = useBuilderStore((s) => s.setRecipientName)
  const setGiftNote = useBuilderStore((s) => s.setGiftNote)
  const setGreetingCard = useBuilderStore((s) => s.setGreetingCard)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-semibold text-foreground">
          Make it personal
        </h2>
        <p className="mt-1 text-muted-foreground">
          Add a name, choose a card and write a heartfelt note.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient&apos;s name</Label>
            <Input
              id="recipient"
              placeholder="e.g. Amara"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Greeting card</Label>
            <div className="grid grid-cols-1 gap-2">
              {greetingCards.map((card) => {
                const isSelected = greetingCard?.id === card.id
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() =>
                      setGreetingCard(isSelected ? null : card)
                    }
                    className={cn(
                      "flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all",
                      isSelected
                        ? "border-gold ring-2 ring-gold/40 bg-accent/40"
                        : "border-border bg-card hover:border-gold/50"
                    )}
                  >
                    <span className="font-medium text-foreground">
                      {card.name}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {card.price_lkr === 0 ? "Free" : formatLKR(card.price_lkr)}
                      </span>
                      {isSelected && (
                        <span className="flex size-5 items-center justify-center rounded-full bg-gold text-gold-foreground">
                          <CheckIcon className="size-3.5" />
                        </span>
                      )}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="note">Your message</Label>
              <span className="text-xs text-muted-foreground tabular-nums">
                {giftNote.length}/{NOTE_MAX}
              </span>
            </div>
            <Textarea
              id="note"
              rows={4}
              maxLength={NOTE_MAX}
              placeholder="Write something they'll treasure…"
              value={giftNote}
              onChange={(e) => setGiftNote(e.target.value)}
            />
          </div>
        </div>

        {/* Live card preview */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-2 text-sm font-medium text-foreground">Preview</p>
          <div className="relative aspect-[5/7] w-full overflow-hidden rounded-2xl border border-border bg-gratitud-wash p-8 shadow-lg">
            <div className="flex h-full flex-col">
              <span className="font-heading text-xs uppercase tracking-widest text-muted-foreground">
                {greetingCard?.name ?? "No card selected"}
              </span>
              <div className="mt-6 flex-1">
                {recipientName && (
                  <p className="font-script text-3xl text-charcoal">
                    Dear {recipientName},
                  </p>
                )}
                <p className="mt-4 whitespace-pre-wrap font-script text-2xl leading-snug text-charcoal/90">
                  {giftNote || "Your handwritten note will appear here…"}
                </p>
              </div>
              <p className="mt-6 text-right font-heading text-sm text-muted-foreground">
                with love, via GratituD.lk
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

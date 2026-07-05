"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { GreetingCard, PackagingOption, Product } from "@/types/db"
import { BUILDER_STEPS, type BuilderStepId } from "@/lib/constants"

export interface BoxLineItem {
  product: Product
  quantity: number
}

interface BuilderState {
  currentStep: BuilderStepId
  packaging: PackagingOption | null
  items: Record<string, BoxLineItem>
  greetingCard: GreetingCard | null
  recipientName: string
  giftNote: string

  // navigation
  setStep: (step: BuilderStepId) => void
  next: () => void
  prev: () => void

  // packaging
  setPackaging: (packaging: PackagingOption) => void

  // items
  addItem: (product: Product) => { ok: boolean; reason?: string }
  incrementItem: (productId: string) => { ok: boolean; reason?: string }
  decrementItem: (productId: string) => void
  removeItem: (productId: string) => void

  // personalization
  setGreetingCard: (card: GreetingCard | null) => void
  setRecipientName: (name: string) => void
  setGiftNote: (note: string) => void

  reset: () => void
}

const stepIndex = (id: BuilderStepId) =>
  BUILDER_STEPS.findIndex((s) => s.id === id)

/** Fields written to localStorage by the persist middleware. */
type PersistedBuilderState = Pick<
  BuilderState,
  | "currentStep"
  | "packaging"
  | "items"
  | "greetingCard"
  | "recipientName"
  | "giftNote"
>

const emptyPersistedState = (): PersistedBuilderState => ({
  currentStep: "packaging",
  packaging: null,
  items: {},
  greetingCard: null,
  recipientName: "",
  giftNote: "",
})

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set, get) => ({
      currentStep: "packaging",
      packaging: null,
      items: {},
      greetingCard: null,
      recipientName: "",
      giftNote: "",

      setStep: (step) => set({ currentStep: step }),

      next: () => {
        const i = stepIndex(get().currentStep)
        const nextStep = BUILDER_STEPS[Math.min(i + 1, BUILDER_STEPS.length - 1)]
        set({ currentStep: nextStep.id })
      },

      prev: () => {
        const i = stepIndex(get().currentStep)
        const prevStep = BUILDER_STEPS[Math.max(i - 1, 0)]
        set({ currentStep: prevStep.id })
      },

      setPackaging: (packaging) => set({ packaging }),

      addItem: (product) => {
        const { packaging, items } = get()
        if (!packaging) return { ok: false, reason: "Choose a box first." }

        const used = usedCapacity(items)
        if (used + product.capacity > packaging.capacity) {
          return { ok: false, reason: "Your box is full — pick a larger box or remove an item." }
        }

        const existing = items[product.id]
        set({
          items: {
            ...items,
            [product.id]: {
              product,
              quantity: existing ? existing.quantity + 1 : 1,
            },
          },
        })
        return { ok: true }
      },

      incrementItem: (productId) => {
        const { packaging, items } = get()
        const line = items[productId]
        if (!line || !packaging) return { ok: false }

        const used = usedCapacity(items)
        if (used + line.product.capacity > packaging.capacity) {
          return { ok: false, reason: "Your box is full." }
        }
        set({
          items: {
            ...items,
            [productId]: { ...line, quantity: line.quantity + 1 },
          },
        })
        return { ok: true }
      },

      decrementItem: (productId) => {
        const { items } = get()
        const line = items[productId]
        if (!line) return
        if (line.quantity <= 1) {
          const next = { ...items }
          delete next[productId]
          set({ items: next })
        } else {
          set({
            items: {
              ...items,
              [productId]: { ...line, quantity: line.quantity - 1 },
            },
          })
        }
      },

      removeItem: (productId) => {
        const next = { ...get().items }
        delete next[productId]
        set({ items: next })
      },

      setGreetingCard: (card) => set({ greetingCard: card }),
      setRecipientName: (name) => set({ recipientName: name }),
      setGiftNote: (note) => set({ giftNote: note }),

      reset: () =>
        set({
          currentStep: "packaging",
          packaging: null,
          items: {},
          greetingCard: null,
          recipientName: "",
          giftNote: "",
        }),
    }),
    {
      name: "gratitud-builder",
      version: 2,
      // v1 used static string IDs; v2 uses Supabase UUIDs — discard incompatible state.
      migrate: (persisted, version) => {
        if (version < 2) return emptyPersistedState()
        return persisted as PersistedBuilderState
      },
      partialize: (state) => ({
        currentStep: state.currentStep,
        packaging: state.packaging,
        items: state.items,
        greetingCard: state.greetingCard,
        recipientName: state.recipientName,
        giftNote: state.giftNote,
      }),
    }
  )
)

// ---------- Pure selectors (kept outside the store for reuse) ----------

export function usedCapacity(items: Record<string, BoxLineItem>): number {
  return Object.values(items).reduce(
    (sum, line) => sum + line.product.capacity * line.quantity,
    0
  )
}

export function itemsSubtotal(items: Record<string, BoxLineItem>): number {
  return Object.values(items).reduce(
    (sum, line) => sum + line.product.price_lkr * line.quantity,
    0
  )
}

export function totalItemCount(items: Record<string, BoxLineItem>): number {
  return Object.values(items).reduce((sum, line) => sum + line.quantity, 0)
}

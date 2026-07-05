"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { CartBox } from "@/types/cart"

interface CartState {
  boxes: CartBox[]
  addBox: (box: CartBox) => void
  removeBox: (id: string) => void
  clear: () => void
  count: () => number
  subtotalLkr: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      boxes: [],

      addBox: (box) => set({ boxes: [...get().boxes, box] }),

      removeBox: (id) =>
        set({ boxes: get().boxes.filter((b) => b.id !== id) }),

      clear: () => set({ boxes: [] }),

      count: () => get().boxes.length,

      subtotalLkr: () =>
        get().boxes.reduce((sum, b) => sum + b.subtotalLkr, 0),
    }),
    { name: "gratitud-cart", version: 1 }
  )
)

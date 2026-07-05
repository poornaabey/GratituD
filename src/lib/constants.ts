/**
 * App-wide constants for GratituD.lk.
 */

export const SITE = {
  name: "GratituD.lk",
  tagline: "Curated gifts, made personal.",
  city: "Colombo, Sri Lanka",
} as const

/** Steps of the interactive gift builder (drives the wizard + progress bar). */
export const BUILDER_STEPS = [
  { id: "packaging", label: "Packaging" },
  { id: "items", label: "Curate Items" },
  { id: "personalize", label: "Personalize" },
  { id: "review", label: "Review" },
] as const

export type BuilderStepId = (typeof BUILDER_STEPS)[number]["id"]

/**
 * LKR is stored as integer cents everywhere. Convert + format at the edges only.
 */
export function formatLKR(cents: number): string {
  const rupees = cents / 100
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(rupees)
}

export function rupeesToCents(rupees: number): number {
  return Math.round(rupees * 100)
}

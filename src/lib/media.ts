/** Supabase Storage bucket for catalog & marketing assets. */
export const MEDIA_BUCKET = "media"

/** Hero image path in storage (Tier 1 stock). */
export const HERO_IMAGE_PATH = "marketing/hero.jpg"

/**
 * Resolve a DB `image_url` to a public URL.
 * Supports storage paths (`products/foo.jpg`) or full HTTPS URLs.
 */
export function resolveMediaUrl(pathOrUrl: string | null | undefined): string | null {
  if (!pathOrUrl?.trim()) return null

  const value = pathOrUrl.trim()
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value
  }

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "")
  if (!base) return null

  const normalized = value.replace(/^\/+/, "")
  return `${base}/storage/v1/object/public/${MEDIA_BUCKET}/${normalized}`
}

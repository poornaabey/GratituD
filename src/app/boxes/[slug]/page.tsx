import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon, GiftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Container } from "@/components/layout/container"
import { formatLKR } from "@/lib/constants"
import { getFeaturedBoxBySlug } from "@/lib/data/catalog"
import {
  FEATURED_BOX_FALLBACK,
  featuredBoxAccentClass,
} from "@/lib/featured-boxes"

interface BoxDetailPageProps {
  params: Promise<{ slug: string }>
}

async function resolveBox(slug: string) {
  const fromDb = await getFeaturedBoxBySlug(slug)
  if (fromDb) return fromDb

  const fallback = FEATURED_BOX_FALLBACK.find((b) => b.slug === slug)
  if (!fallback) return null

  return {
    ...fallback,
    image_url: null,
    is_active: true,
    created_at: new Date(0).toISOString(),
  }
}

export async function generateMetadata({
  params,
}: BoxDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const box = await resolveBox(slug)
  if (!box) return { title: "Box not found" }

  return {
    title: box.name,
    description: box.description ?? undefined,
  }
}

export default async function BoxDetailPage({ params }: BoxDetailPageProps) {
  const { slug } = await params
  const box = await resolveBox(slug)

  if (!box) notFound()

  return (
    <Container className="py-10 md:py-14">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 mb-6"
        render={<Link href="/boxes" />}
      >
        <ArrowLeftIcon className="size-4" />
        Back to shop
      </Button>

      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div
          className={`flex aspect-square items-center justify-center rounded-3xl border border-border/60 ${featuredBoxAccentClass(box.slug)}`}
        >
          <GiftIcon className="size-20 text-foreground/60" />
        </div>

        <div className="space-y-6">
          <div>
            <Badge variant="outline" className="border-gold/40 text-gold-foreground">
              Pre-curated
            </Badge>
            <h1 className="mt-4 font-heading text-3xl font-semibold sm:text-4xl">
              {box.name}
            </h1>
            <p className="mt-3 text-2xl font-medium tabular-nums text-foreground">
              {formatLKR(box.base_price_lkr)}
            </p>
          </div>

          {box.description && (
            <p className="text-lg leading-relaxed text-muted-foreground">
              {box.description}
            </p>
          )}

          <p className="text-sm text-muted-foreground">
            Each box is assembled by our team with premium packaging and a
            personalized note. Delivery available across Colombo and suburbs.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" render={<Link href="/build" />}>
              <GiftIcon className="size-4" />
              Customize & order
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/boxes" />}
            >
              Browse all boxes
            </Button>
          </div>
        </div>
      </div>
    </Container>
  )
}

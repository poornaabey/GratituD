import Link from "next/link"
import { CatalogImage } from "@/components/ui/catalog-image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { formatLKR } from "@/lib/constants"
import { featuredBoxAccentClass } from "@/lib/featured-boxes"
import type { FeaturedBox } from "@/types/db"

type FeaturedBoxCardProps = Pick<
  FeaturedBox,
  "name" | "slug" | "description" | "base_price_lkr" | "image_url"
>

export function FeaturedBoxCard({ box }: { box: FeaturedBoxCardProps }) {
  return (
    <Card className="overflow-hidden pt-0 transition-shadow hover:shadow-lg">
      <CatalogImage
        src={box.image_url}
        alt={box.name}
        aspectClass="aspect-[4/3]"
        fallbackClassName={featuredBoxAccentClass(box.slug)}
        fallbackIcon="gift"
        iconClassName="size-10 text-foreground/70"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
      />
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-heading text-lg font-medium text-foreground">
            {box.name}
          </h3>
          <Badge variant="secondary">{formatLKR(box.base_price_lkr)}</Badge>
        </div>
        {box.description && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {box.description}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="secondary"
          className="w-full"
          render={<Link href={`/boxes/${box.slug}`} />}
        >
          View box
        </Button>
      </CardFooter>
    </Card>
  )
}

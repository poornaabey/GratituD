import Link from "next/link"
import { GiftIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { formatLKR } from "@/lib/constants"
import { featuredBoxAccentClass } from "@/lib/featured-boxes"
import type { FeaturedBox } from "@/types/db"

type FeaturedBoxCardProps = Pick<
  FeaturedBox,
  "name" | "slug" | "description" | "base_price_lkr"
>

export function FeaturedBoxCard({ box }: { box: FeaturedBoxCardProps }) {
  return (
    <Card className="overflow-hidden pt-0 transition-shadow hover:shadow-lg">
      <div
        className={`flex aspect-[4/3] items-center justify-center ${featuredBoxAccentClass(box.slug)}`}
      >
        <GiftIcon className="size-10 text-foreground/70" />
      </div>
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

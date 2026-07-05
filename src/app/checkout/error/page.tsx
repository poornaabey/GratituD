import type { Metadata } from "next"
import Link from "next/link"
import { AlertCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"

export const metadata: Metadata = {
  title: "Payment Failed",
}

export default async function CheckoutErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>
}) {
  const params = await searchParams
  const reason =
    params.reason ??
    "Something went wrong while processing your payment. Please try again."

  return (
    <Container className="py-16 text-center">
      <AlertCircleIcon className="mx-auto size-14 text-destructive" />
      <h1 className="mt-6 font-heading text-3xl font-semibold">
        Payment could not be completed
      </h1>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">{reason}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        If money was deducted, PayHere will reconcile automatically. Contact us
        with your order reference if you need help.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button render={<Link href="/checkout" />}>Try checkout again</Button>
        <Button variant="outline" render={<Link href="/cart" />}>
          Back to cart
        </Button>
      </div>
    </Container>
  )
}

import type { Metadata } from "next"
import Link from "next/link"

import { PayHereRedirectForm } from "@/components/checkout/payhere-redirect-form"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"
import { getPayHereCheckoutPayload } from "@/lib/actions/payhere-checkout"
import { getPayHereConfig, getPayHereDomain } from "@/lib/payments/payhere"

export const metadata: Metadata = {
  title: "Pay with PayHere",
  robots: { index: false, follow: false },
}

interface PayHerePageProps {
  searchParams: Promise<{ orders?: string }>
}

export default async function PayHereCheckoutPage({ searchParams }: PayHerePageProps) {
  const { orders } = await searchParams

  if (!orders) {
    return (
      <Container className="py-16 text-center">
        <p className="text-muted-foreground">Missing order reference.</p>
        <Button className="mt-4" render={<Link href="/checkout" />}>
          Back to checkout
        </Button>
      </Container>
    )
  }

  const payload = await getPayHereCheckoutPayload(orders)
  const config = getPayHereConfig()
  const setupDomain = getPayHereDomain(config) ?? undefined

  if (!payload.ok) {
    return (
      <Container className="py-16 text-center">
        <p className="font-heading text-xl text-foreground">Payment unavailable</p>
        <p className="mt-2 text-muted-foreground">{payload.error}</p>
        <Button className="mt-6" render={<Link href="/checkout" />}>
          Back to checkout
        </Button>
      </Container>
    )
  }

  return (
    <PayHereRedirectForm
      action={payload.data.action}
      fields={payload.data.fields}
      setupDomain={setupDomain}
    />
  )
}

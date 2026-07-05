import type { Metadata } from "next"

import { CheckoutSuccess } from "@/components/checkout/checkout-success"

export const metadata: Metadata = {
  title: "Order Confirmed",
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orders?: string; demo?: string }>
}) {
  const params = await searchParams
  const orderIds = params.orders?.split(",").filter(Boolean) ?? []

  return (
    <CheckoutSuccess orderIds={orderIds} isDemo={params.demo === "1"} />
  )
}

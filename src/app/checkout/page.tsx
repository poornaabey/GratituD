import type { Metadata } from "next"

import { CheckoutForm } from "@/components/checkout/checkout-form"
import { PayHereSandboxNotice } from "@/components/checkout/payhere-sandbox-notice"
import { getDeliveryZones } from "@/lib/data/catalog"

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your GratituD gift box order with delivery across Colombo.",
}

export default async function CheckoutPage() {
  const zones = await getDeliveryZones()
  return (
    <>
      <div className="mx-auto max-w-6xl px-5 pt-8">
        <PayHereSandboxNotice />
      </div>
      <CheckoutForm zones={zones} />
    </>
  )
}

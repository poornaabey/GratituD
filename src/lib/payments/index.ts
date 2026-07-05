import type { PaymentProvider } from "./provider"

/** Returns the PayHere payment provider. */
export async function getPaymentProvider(): Promise<PaymentProvider> {
  const { payHereProvider } = await import("./payhere")
  return payHereProvider
}

export type { PaymentProvider } from "./provider"

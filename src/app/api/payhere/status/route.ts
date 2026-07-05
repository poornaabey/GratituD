import { NextResponse } from "next/server"

import {
  getPayHereConfig,
  getPayHereDomain,
  getPayHereNotifyDomain,
  isPayHereConfigured,
} from "@/lib/payments/payhere-utils"

/** Public config check — no secrets exposed. */
export async function GET() {
  const config = getPayHereConfig()

  return NextResponse.json({
    configured: isPayHereConfigured(config),
    sandbox: config.sandbox,
    merchantId: config.merchantId || null,
    siteUrl: config.siteUrl,
    checkoutDomain: getPayHereDomain(config),
    notifyDomain: getPayHereNotifyDomain(config),
    notifyUrl: `${config.siteUrl.replace(/\/$/, "")}/api/payhere/notify`,
    secretSet: Boolean(config.merchantSecret),
  })
}

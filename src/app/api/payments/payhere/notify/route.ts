import { handlePayHereNotify } from "@/lib/payments/payhere-notify-handler"

/** @deprecated Use /api/payhere/notify — kept for existing PayHere dashboard URLs. */
export async function POST(request: Request) {
  return handlePayHereNotify(request)
}

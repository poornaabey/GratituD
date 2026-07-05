import {
  getPayHereConfig,
  getPayHereDomain,
  getPayHereNotifyDomain,
} from "@/lib/payments/payhere"

export function PayHereSandboxNotice() {
  const env = process.env.NEXT_PUBLIC_PAYHERE_ENV
  const legacySandbox = process.env.NEXT_PUBLIC_PAYHERE_SANDBOX !== "false"
  if (env === "production" || (!env && !legacySandbox)) return null

  const config = getPayHereConfig()
  const checkoutDomain = getPayHereDomain(config) ?? "—"
  const notifyDomain = getPayHereNotifyDomain(config) ?? "—"

  return (
    <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
      <p className="font-medium text-foreground">PayHere sandbox setup</p>
      <p className="mt-1 text-muted-foreground">
        &quot;Unauthorized payment request&quot; means your{" "}
        <strong className="font-medium text-foreground">
          merchant secret does not match
        </strong>{" "}
        the domain registered in PayHere.
      </p>
      <ol className="mt-3 list-decimal space-y-1 pl-5 text-muted-foreground">
        <li>
          <a
            href="https://sandbox.payhere.lk"
            className="text-foreground underline"
            target="_blank"
            rel="noreferrer"
          >
            sandbox.payhere.lk
          </a>{" "}
          → Integrations → Add Domain/App
        </li>
        <li>
          Register <code className="text-foreground">{notifyDomain}</code>{" "}
          (or <code className="text-foreground">ngrok-free.dev</code> for any
          ngrok subdomain)
        </li>
        <li>Wait for approval, then copy that domain&apos;s merchant secret</li>
        <li>
          Paste into <code className="text-foreground">PAYHERE_MERCHANT_SECRET</code>{" "}
          and restart the dev server
        </li>
        <li>
          Keep ngrok running:{" "}
          <code className="text-foreground">ngrok http 3003</code>
        </li>
      </ol>
      <p className="mt-2 text-xs text-muted-foreground">
        Checkout domain: {checkoutDomain} · Notify domain: {notifyDomain}
      </p>
    </div>
  )
}

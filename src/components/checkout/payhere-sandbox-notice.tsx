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
        &quot;Unauthorized payment request&quot; almost always means PayHere has
        not <strong className="font-medium text-foreground">approved</strong>{" "}
        your domain yet, or the domain was registered with the wrong format.
      </p>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-muted-foreground">
        <li>
          Open{" "}
          <a
            href="https://sandbox.payhere.lk"
            className="text-foreground underline"
            target="_blank"
            rel="noreferrer"
          >
            sandbox.payhere.lk
          </a>{" "}
          → <strong className="text-foreground">Integrations</strong> → Add
          Domain/App
        </li>
        <li>
          Register the hostname only:{" "}
          <code className="rounded bg-background/80 px-1.5 py-0.5 text-foreground">
            {notifyDomain}
          </code>
          <span className="block mt-1 text-xs">
            Do not include <code className="text-foreground">https://</code>, paths,
            or trailing slashes.
          </span>
        </li>
        <li>
          Wait until status shows <strong className="text-foreground">Approved</strong>{" "}
          (can take up to 24 hours)
        </li>
        <li>
          Copy the merchant secret from that approved domain row into Vercel →{" "}
          <code className="text-foreground">PAYHERE_MERCHANT_SECRET</code>, then
          redeploy
        </li>
        <li>
          For local ngrok testing, register your ngrok hostname separately and use
          that domain&apos;s secret in <code className="text-foreground">.env.local</code>
        </li>
      </ol>
      <p className="mt-3 text-xs text-muted-foreground">
        Checkout domain: {checkoutDomain} · Notify: {notifyDomain}/api/payhere/notify
        · Config check:{" "}
        <a
          href="/api/payhere/status"
          className="text-foreground underline"
          target="_blank"
          rel="noreferrer"
        >
          /api/payhere/status
        </a>
      </p>
    </div>
  )
}

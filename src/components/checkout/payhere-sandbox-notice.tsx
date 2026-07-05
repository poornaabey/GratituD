import {
  getPayHereConfig,
  getPayHereDomain,
  getPayHereNotifyDomain,
} from "@/lib/payments/payhere"

function isVercelAppHostname(hostname: string): boolean {
  return hostname.endsWith(".vercel.app")
}

export function PayHereSandboxNotice() {
  const env = process.env.NEXT_PUBLIC_PAYHERE_ENV
  const legacySandbox = process.env.NEXT_PUBLIC_PAYHERE_SANDBOX !== "false"
  if (env === "production" || (!env && !legacySandbox)) return null

  const config = getPayHereConfig()
  const checkoutDomain = getPayHereDomain(config) ?? "—"
  const notifyDomain = getPayHereNotifyDomain(config) ?? "—"
  const onVercelDefault = isVercelAppHostname(notifyDomain)

  return (
    <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
      <p className="font-medium text-foreground">PayHere sandbox setup</p>

      {onVercelDefault ? (
        <>
          <p className="mt-1 text-muted-foreground">
            <strong className="font-medium text-foreground">
              {notifyDomain}
            </strong>{" "}
            cannot be registered in PayHere — they block{" "}
            <code className="text-foreground">*.vercel.app</code> subdomains
            (&quot;Sub Domains not allowed&quot;). Registering as an{" "}
            <strong className="font-medium text-foreground">App</strong> only
            works for mobile SDKs, not website checkout, so payments will stay
            unauthorized on this URL.
          </p>
          <p className="mt-2 font-medium text-foreground">What works instead</p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-muted-foreground">
            <li>
              <strong className="text-foreground">Custom domain (recommended)</strong>{" "}
              — add e.g. <code className="text-foreground">gratitud.lk</code> or{" "}
              <code className="text-foreground">shop.gratitud.lk</code> in Vercel →
              Domains, then register that hostname in PayHere as{" "}
              <strong className="text-foreground">Domain</strong> (not App)
            </li>
            <li>
              <strong className="text-foreground">ngrok for testing</strong> —{" "}
              <code className="text-foreground">ngrok http 3003</code>, register
              the ngrok hostname as Domain, use that domain&apos;s secret locally
            </li>
            <li>
              Email{" "}
              <a
                href="mailto:techsupport@payhere.lk"
                className="text-foreground underline"
              >
                techsupport@payhere.lk
              </a>{" "}
              to ask if they can whitelist your Vercel URL
            </li>
          </ol>
        </>
      ) : (
        <>
          <p className="mt-1 text-muted-foreground">
            &quot;Unauthorized payment request&quot; means PayHere has not{" "}
            <strong className="font-medium text-foreground">approved</strong> your
            domain, the secret does not match, or you registered an{" "}
            <strong className="font-medium text-foreground">App</strong> instead of
            a <strong className="font-medium text-foreground">Domain</strong> (Apps
            are for mobile SDKs only).
          </p>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-muted-foreground">
            <li>
              <a
                href="https://sandbox.payhere.lk"
                className="text-foreground underline"
                target="_blank"
                rel="noreferrer"
              >
                sandbox.payhere.lk
              </a>{" "}
              → Integrations → Add Domain/App → choose{" "}
              <strong className="text-foreground">Domain</strong>
            </li>
            <li>
              Register hostname only:{" "}
              <code className="text-foreground">{notifyDomain}</code>
            </li>
            <li>Wait for Approved, copy that row&apos;s secret to Vercel</li>
          </ol>
        </>
      )}

      <p className="mt-3 text-xs text-muted-foreground">
        Checkout: {checkoutDomain} · Notify: {notifyDomain}/api/payhere/notify ·{" "}
        <a href="/api/payhere/status" className="text-foreground underline">
          config status
        </a>
      </p>
    </div>
  )
}

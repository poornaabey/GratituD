"use client"

import * as React from "react"

export function PayHereRedirectForm({
  action,
  fields,
  setupDomain,
}: {
  action: string
  fields: Record<string, string>
  setupDomain?: string
}) {
  const formRef = React.useRef<HTMLFormElement>(null)

  React.useEffect(() => {
    formRef.current?.submit()
  }, [])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <p className="font-heading text-xl text-foreground">
        Redirecting to PayHere…
      </p>
      <p className="text-sm text-muted-foreground">
        Secure payment in LKR. Please wait.
      </p>
      {setupDomain && (
        <div className="mt-4 max-w-md rounded-lg border border-border bg-muted/40 p-4 text-left text-xs text-muted-foreground">
          <p className="font-medium text-foreground">PayHere sandbox checklist</p>
          <ol className="mt-2 list-decimal space-y-1 pl-4">
            <li>
              Keep ngrok running:{" "}
              <code className="text-foreground">ngrok http 3003</code>
            </li>
            <li>
              In{" "}
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
              Register:{" "}
              <code className="text-foreground">{setupDomain}</code> (or{" "}
              <code className="text-foreground">ngrok-free.dev</code> for any
              ngrok subdomain)
            </li>
            <li>
              Copy the merchant secret for that domain into{" "}
              <code className="text-foreground">PAYHERE_MERCHANT_SECRET</code>
            </li>
            <li>
              Set{" "}
              <code className="text-foreground">NEXT_PUBLIC_SITE_URL</code> to
              your ngrok HTTPS URL
            </li>
          </ol>
          <p className="mt-2">
            &quot;Unauthorized payment request&quot; means the secret does not
            match the registered domain, or ngrok is offline.
          </p>
        </div>
      )}
      <form ref={formRef} method="POST" action={action} className="hidden">
        {Object.entries(fields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
      </form>
    </div>
  )
}

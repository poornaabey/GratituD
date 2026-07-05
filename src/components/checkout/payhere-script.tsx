"use client"

import Script from "next/script"
import * as React from "react"

import { getPayHereSdkScriptUrl } from "@/lib/payments/payhere-client"

type PayHereHandlers = {
  onCompleted?: (orderId: string) => void
  onDismissed?: () => void
  onError?: (error: string) => void
}

const PayHereHandlersContext = React.createContext<PayHereHandlers>({})

export function usePayHereHandlers() {
  return React.useContext(PayHereHandlersContext)
}

export function PayHereScriptProvider({
  children,
  handlers,
}: {
  children: React.ReactNode
  handlers: PayHereHandlers
}) {
  const [ready, setReady] = React.useState(false)
  const handlersRef = React.useRef(handlers)
  handlersRef.current = handlers

  React.useEffect(() => {
    if (!ready || !window.payhere) return

    window.payhere.onCompleted = (orderId: string) => {
      handlersRef.current.onCompleted?.(orderId)
    }
    window.payhere.onDismissed = () => {
      handlersRef.current.onDismissed?.()
    }
    window.payhere.onError = (error: string) => {
      handlersRef.current.onError?.(error)
    }
  }, [ready])

  return (
    <PayHereHandlersContext.Provider value={handlers}>
      <Script
        src={getPayHereSdkScriptUrl()}
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
      />
      {children}
    </PayHereHandlersContext.Provider>
  )
}

export interface PayHerePayment {
  sandbox: boolean
  merchant_id: string
  /** Must be undefined for JS SDK onsite checkout (PayHere docs). */
  return_url?: undefined
  cancel_url?: undefined
  notify_url: string
  order_id: string
  items: string
  amount: string
  currency: string
  hash: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
}

export interface PayHereSdk {
  onCompleted: (orderId: string) => void
  onDismissed: () => void
  onError: (error: string) => void
  startPayment: (payment: PayHerePayment) => void
}

declare global {
  interface Window {
    payhere?: PayHereSdk
  }
}

export {}

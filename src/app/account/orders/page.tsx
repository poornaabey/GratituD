import Link from "next/link"
import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"
import { formatLKR } from "@/lib/constants"
import { createClient } from "@/lib/supabase/server"
import type { Order } from "@/types/db"

export const metadata = {
  title: "My Orders",
}

export default async function AccountOrdersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth")

  const { data: ordersRaw } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })

  const orders = (ordersRaw ?? []) as Order[]

  return (
    <Container className="py-8 md:py-12">
      <h1 className="font-heading text-3xl font-semibold">My orders</h1>
      <p className="mt-1 text-muted-foreground">
        Signed in as {user.email}
      </p>

      {!orders?.length ? (
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">No orders yet.</p>
          <Button className="mt-4" render={<Link href="/build" />}>
            Build your first gift box
          </Button>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5"
            >
              <div>
                <p className="font-medium text-foreground">
                  Order {order.id.slice(0, 8).toUpperCase()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Delivery {order.delivery_date} · {order.city}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium tabular-nums">
                  {formatLKR(order.total_lkr)}
                </p>
                <p className="text-sm capitalize text-muted-foreground">
                  {order.status.replace(/_/g, " ")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Container>
  )
}

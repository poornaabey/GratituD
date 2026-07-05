import { redirect } from "next/navigation"

/** Legacy redirect checkout — PayHere JS SDK is used on /checkout now. */
export default function PayHereLegacyRedirect() {
  redirect("/checkout")
}

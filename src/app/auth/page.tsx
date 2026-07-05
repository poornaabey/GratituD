import type { Metadata } from "next"

import { AuthForm } from "@/components/auth/auth-form"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to GratituD.lk to save occasions and track your gift orders.",
}

export default function AuthPage() {
  return <AuthForm />
}

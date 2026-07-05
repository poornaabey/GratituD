import "server-only"

import { createClient } from "@/lib/supabase/server"
import type {
  Category,
  DeliveryZone,
  FeaturedBox,
  GreetingCard,
  PackagingOption,
  Product,
} from "@/types/db"

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order")

  if (error) throw error
  return data ?? []
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("name")

  if (error) throw error
  return data ?? []
}

export async function getPackagingOptions(): Promise<PackagingOption[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("packaging_options")
    .select("*")
    .eq("is_active", true)
    .order("capacity")

  if (error) throw error
  return data ?? []
}

export async function getGreetingCards(): Promise<GreetingCard[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("greeting_cards")
    .select("*")
    .eq("is_active", true)
    .order("price_lkr")

  if (error) throw error
  return data ?? []
}

export async function getDeliveryZones(): Promise<DeliveryZone[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("delivery_zones")
    .select("*")
    .eq("is_active", true)
    .order("fee_lkr")

  if (error) throw error
  return data ?? []
}

export async function getFeaturedBoxes(): Promise<FeaturedBox[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("featured_boxes")
    .select("*")
    .eq("is_active", true)
    .order("name")

  if (error) throw error
  return data ?? []
}

export async function getBuilderCatalog() {
  const [categories, products, packagingOptions, greetingCards] =
    await Promise.all([
      getCategories(),
      getProducts(),
      getPackagingOptions(),
      getGreetingCards(),
    ])

  return { categories, products, packagingOptions, greetingCards }
}

export type BuilderCatalog = Awaited<ReturnType<typeof getBuilderCatalog>>

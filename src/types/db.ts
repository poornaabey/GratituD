/**
 * Database types for GratituD.lk.
 *
 * This is a hand-written type surface that mirrors supabase/migrations/0001_init.sql.
 * Once the schema is live you can regenerate a fuller version with:
 *   npx supabase gen types typescript --project-id <id> > src/types/db.ts
 */

export type OrderStatus =
  | "pending"
  | "paid"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"

export type BoxSize = "petite" | "classic" | "grand" | "luxe"

export interface Category {
  id: string
  name: string
  slug: string
  sort_order: number
}

export interface Product {
  id: string
  category_id: string | null
  name: string
  description: string | null
  price_lkr: number
  image_url: string | null
  capacity: number
  stock: number
  is_active: boolean
  created_at: string
}

export interface PackagingOption {
  id: string
  name: string
  size: BoxSize
  capacity: number
  color: string | null
  wrap_style: string | null
  price_lkr: number
  image_url: string | null
  is_active: boolean
}

export interface GreetingCard {
  id: string
  name: string
  image_url: string | null
  price_lkr: number
  is_active: boolean
}

export interface DeliveryZone {
  id: string
  name: string
  fee_lkr: number
  is_active: boolean
}

export interface FeaturedBox {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  base_price_lkr: number
  is_active: boolean
  created_at: string
}

export interface CustomBox {
  id: string
  profile_id: string | null
  packaging_id: string | null
  greeting_card_id: string | null
  recipient_name: string | null
  gift_note: string | null
  subtotal_lkr: number
  created_at: string
}

export interface CustomBoxItem {
  id: string
  custom_box_id: string
  product_id: string | null
  quantity: number
  unit_price_lkr: number
}

export interface Order {
  id: string
  profile_id: string | null
  custom_box_id: string | null
  status: OrderStatus
  contact_name: string
  contact_email: string
  contact_phone: string
  address_line1: string
  address_line2: string | null
  city: string
  zone_id: string | null
  delivery_date: string
  delivery_notes: string | null
  subtotal_lkr: number
  delivery_fee_lkr: number
  total_lkr: number
  payment_provider: string | null
  payment_ref: string | null
  paid_at: string | null
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_name: string
  quantity: number
  unit_price_lkr: number
}

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  is_admin: boolean
  created_at: string
}

export interface SavedOccasion {
  id: string
  profile_id: string
  label: string
  occasion_date: string
  recipient: string | null
  created_at: string
}

type Relationship = {
  foreignKeyName: string
  columns: string[]
  isOneToOne?: boolean
  referencedRelation: string
  referencedColumns: string[]
}

type TableShape<T> = {
  Row: T
  Insert: Record<string, unknown>
  Update: Record<string, unknown>
  Relationships: Relationship[]
}

export interface Database {
  public: {
    Tables: {
      profiles: TableShape<Profile>
      saved_occasions: TableShape<SavedOccasion>
      categories: TableShape<Category>
      products: TableShape<Product>
      packaging_options: TableShape<PackagingOption>
      greeting_cards: TableShape<GreetingCard>
      delivery_zones: TableShape<DeliveryZone>
      featured_boxes: TableShape<FeaturedBox>
      custom_boxes: TableShape<CustomBox>
      custom_box_items: TableShape<CustomBoxItem>
      orders: TableShape<Order>
      order_items: TableShape<OrderItem>
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
    Enums: {
      order_status: OrderStatus
      box_size: BoxSize
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

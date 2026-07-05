-- ============================================================================
-- GratituD.lk — Initial schema
-- Premium curated gift-pack builder (Colombo & suburbs)
-- All monetary values stored as integers in LKR cents (avoid float errors).
-- ============================================================================

-- ---------- EXTENSIONS ----------
create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ---------- ENUMS ----------
create type order_status as enum
  ('pending', 'paid', 'preparing', 'out_for_delivery', 'delivered', 'cancelled');
create type box_size as enum ('petite', 'classic', 'grand', 'luxe');

-- ============================================================================
-- USERS
-- Supabase manages auth.users; we mirror public profile data here.
-- ============================================================================
create table profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text,
  phone      text,
  is_admin   boolean not null default false,
  created_at timestamptz not null default now()
);

create table saved_occasions (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null references profiles (id) on delete cascade,
  label         text not null,          -- "Mum's Birthday"
  occasion_date date not null,
  recipient     text,
  created_at    timestamptz not null default now()
);

-- ============================================================================
-- CATALOG
-- ============================================================================
create table categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,             -- Chocolates, Candles, Skincare, Tech...
  slug       text not null unique,
  sort_order int not null default 0
);

create table products (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid references categories (id) on delete set null,
  name        text not null,
  description text,
  price_lkr   integer not null,         -- LKR cents
  image_url   text,
  capacity    integer not null default 1, -- slots consumed inside a box
  stock       integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table packaging_options (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,             -- "Signature Charcoal Box"
  size       box_size not null,
  capacity   integer not null,          -- max slots available
  color      text,
  wrap_style text,
  price_lkr  integer not null default 0,
  image_url  text,
  is_active  boolean not null default true
);

create table greeting_cards (
  id        uuid primary key default gen_random_uuid(),
  name      text not null,
  image_url text,
  price_lkr integer not null default 0,
  is_active boolean not null default true
);

-- Delivery zones for Colombo & suburbs (drives delivery fee + routing)
create table delivery_zones (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,           -- "Colombo 03", "Dehiwala", "Nugegoda"
  fee_lkr      integer not null default 0,
  is_active    boolean not null default true
);

-- ============================================================================
-- CURATED / PRE-BUILT BOXES (for users in a hurry)
-- ============================================================================
create table featured_boxes (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  slug           text not null unique,
  description    text,
  image_url      text,
  base_price_lkr integer not null,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now()
);

-- ============================================================================
-- CUSTOM BOX (the gift-builder output)
-- ============================================================================
create table custom_boxes (
  id               uuid primary key default gen_random_uuid(),
  profile_id       uuid references profiles (id) on delete set null, -- null = guest
  packaging_id     uuid references packaging_options (id),
  greeting_card_id uuid references greeting_cards (id),
  recipient_name   text,
  gift_note        text,                -- handwritten-style message
  subtotal_lkr     integer not null default 0,
  created_at       timestamptz not null default now()
);

create table custom_box_items (
  id             uuid primary key default gen_random_uuid(),
  custom_box_id  uuid not null references custom_boxes (id) on delete cascade,
  product_id     uuid references products (id),
  quantity       integer not null default 1,
  unit_price_lkr integer not null       -- price snapshot at add time
);

-- ============================================================================
-- ORDERS
-- ============================================================================
create table orders (
  id               uuid primary key default gen_random_uuid(),
  profile_id       uuid references profiles (id) on delete set null,
  custom_box_id    uuid references custom_boxes (id),
  status           order_status not null default 'pending',

  -- contact (supports guest checkout)
  contact_name     text not null,
  contact_email    text not null,
  contact_phone    text not null,

  -- delivery (Colombo & suburbs)
  address_line1    text not null,
  address_line2    text,
  city             text not null,
  zone_id          uuid references delivery_zones (id),
  delivery_date    date not null,
  delivery_notes   text,

  -- money (LKR cents)
  subtotal_lkr     integer not null,
  delivery_fee_lkr integer not null default 0,
  total_lkr        integer not null,

  -- payments (provider-agnostic: 'stripe' | 'payhere')
  payment_provider text,
  payment_ref      text,
  paid_at          timestamptz,

  created_at       timestamptz not null default now()
);

-- Immutable snapshot of what shipped (survives catalog changes)
create table order_items (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null references orders (id) on delete cascade,
  product_name   text not null,
  quantity       integer not null,
  unit_price_lkr integer not null
);

-- ---------- INDEXES ----------
create index idx_products_category on products (category_id);
create index idx_cbi_box on custom_box_items (custom_box_id);
create index idx_orders_profile on orders (profile_id);
create index idx_orders_status on orders (status);
create index idx_order_items_order on order_items (order_id);
create index idx_saved_occasions_profile on saved_occasions (profile_id);

-- ============================================================================
-- AUTH TRIGGER: auto-create a profile row when a user signs up
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- HELPER: is the current user an admin?
-- ============================================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table profiles          enable row level security;
alter table saved_occasions   enable row level security;
alter table categories        enable row level security;
alter table products          enable row level security;
alter table packaging_options enable row level security;
alter table greeting_cards    enable row level security;
alter table delivery_zones    enable row level security;
alter table featured_boxes    enable row level security;
alter table custom_boxes      enable row level security;
alter table custom_box_items  enable row level security;
alter table orders            enable row level security;
alter table order_items       enable row level security;

-- ---------- PUBLIC CATALOG (read-only for everyone; admin writes) ----------
create policy "catalog public read" on categories        for select using (true);
create policy "catalog public read" on products          for select using (is_active);
create policy "catalog public read" on packaging_options for select using (is_active);
create policy "catalog public read" on greeting_cards    for select using (is_active);
create policy "catalog public read" on delivery_zones    for select using (is_active);
create policy "catalog public read" on featured_boxes    for select using (is_active);

create policy "categories admin write"  on categories        for all using (public.is_admin()) with check (public.is_admin());
create policy "products admin write"    on products          for all using (public.is_admin()) with check (public.is_admin());
create policy "packaging admin write"   on packaging_options for all using (public.is_admin()) with check (public.is_admin());
create policy "cards admin write"       on greeting_cards    for all using (public.is_admin()) with check (public.is_admin());
create policy "zones admin write"       on delivery_zones    for all using (public.is_admin()) with check (public.is_admin());
create policy "featured admin write"    on featured_boxes    for all using (public.is_admin()) with check (public.is_admin());

-- ---------- PROFILES ----------
create policy "own profile read"   on profiles for select using (auth.uid() = id or public.is_admin());
create policy "own profile update" on profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- ---------- SAVED OCCASIONS ----------
create policy "own occasions all" on saved_occasions
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- ---------- CUSTOM BOXES (guests allowed: profile_id may be null) ----------
create policy "custom box read" on custom_boxes
  for select using (profile_id is null or auth.uid() = profile_id or public.is_admin());
create policy "custom box insert" on custom_boxes
  for insert with check (profile_id is null or auth.uid() = profile_id);
create policy "custom box update" on custom_boxes
  for update using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create policy "custom box items read" on custom_box_items
  for select using (
    exists (
      select 1 from custom_boxes b
      where b.id = custom_box_id
        and (b.profile_id is null or b.profile_id = auth.uid() or public.is_admin())
    )
  );
create policy "custom box items insert" on custom_box_items
  for insert with check (
    exists (
      select 1 from custom_boxes b
      where b.id = custom_box_id
        and (b.profile_id is null or b.profile_id = auth.uid())
    )
  );

-- ---------- ORDERS ----------
create policy "orders read" on orders
  for select using (auth.uid() = profile_id or public.is_admin());
create policy "orders insert" on orders
  for insert with check (profile_id is null or auth.uid() = profile_id);
create policy "orders admin update" on orders
  for update using (public.is_admin()) with check (public.is_admin());

create policy "order items read" on order_items
  for select using (
    exists (
      select 1 from orders o
      where o.id = order_id
        and (o.profile_id = auth.uid() or public.is_admin())
    )
  );
create policy "order items insert" on order_items
  for insert with check (
    exists (
      select 1 from orders o
      where o.id = order_id
        and (o.profile_id is null or o.profile_id = auth.uid())
    )
  );

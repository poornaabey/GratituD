-- ============================================================================
-- GratituD.lk — Seed data
-- Prices are in LKR cents (e.g. 250000 = Rs. 2,500.00)
-- image_url values are Supabase Storage paths (bucket: media). Run npm run media:seed
-- ============================================================================

-- ---------- CATEGORIES ----------
insert into categories (name, slug, sort_order) values
  ('Chocolates',   'chocolates',   1),
  ('Candles',      'candles',      2),
  ('Skincare',     'skincare',     3),
  ('Mugs & Drinkware', 'mugs',     4),
  ('Tech Gadgets', 'tech',         5),
  ('Flowers & Botanicals', 'flowers', 6),
  ('Gourmet & Tea', 'gourmet',     7);

-- ---------- PRODUCTS ----------
insert into products (category_id, name, description, price_lkr, capacity, stock, image_url)
select c.id, p.name, p.description, p.price_lkr, p.capacity, p.stock, p.image_url
from (values
  ('chocolates', 'Belgian Dark Truffle Box', 'Rich 70% dark chocolate truffles, box of 9.', 220000, 2, 50, 'products/belgian-dark-truffle.jpg'),
  ('chocolates', 'Salted Caramel Bar',       'Handcrafted milk chocolate with sea salt caramel.', 90000, 1, 80, 'products/salted-caramel-bar.jpg'),
  ('candles',    'Soy Wax Sandalwood Candle','Hand-poured, 40-hour burn, calming sandalwood.', 180000, 2, 40, 'products/sandalwood-candle.jpg'),
  ('candles',    'Lavender Tin Candle',      'Travel-size lavender soy candle.', 95000, 1, 60, 'products/lavender-tin-candle.jpg'),
  ('skincare',   'Rose Hydrating Face Mist', 'Ceylon rosewater facial mist, 100ml.', 150000, 1, 45, 'products/rose-face-mist.jpg'),
  ('skincare',   'Coconut & Vanilla Body Butter', 'Nourishing whipped body butter, 200g.', 175000, 2, 35, 'products/body-butter.jpg'),
  ('mugs',       'Ceramic Matte Mug',        'Minimalist matte-glaze ceramic mug, 350ml.', 140000, 2, 55, 'products/ceramic-mug.jpg'),
  ('mugs',       'Insulated Travel Tumbler', 'Double-wall stainless steel tumbler, 450ml.', 320000, 2, 30, 'products/travel-tumbler.jpg'),
  ('tech',       'Wireless Charging Pad',    'Slim 15W Qi wireless charger.', 450000, 2, 25, 'products/wireless-charger.jpg'),
  ('tech',       'Mini Bluetooth Speaker',   'Pocket-size waterproof speaker.', 520000, 2, 20, 'products/bluetooth-speaker.jpg'),
  ('flowers',    'Preserved Rose in Glass',  'Everlasting real rose under a glass dome.', 380000, 2, 22, 'products/preserved-rose.jpg'),
  ('flowers',    'Dried Flower Posy',        'Petite dried botanical bunch.', 120000, 1, 40, 'products/dried-flower-posy.jpg'),
  ('gourmet',    'Ceylon Tea Sampler',       'Five premium single-estate Ceylon teas.', 260000, 2, 38, 'products/tea-sampler.jpg'),
  ('gourmet',    'Artisan Honey Jar',        'Wild forest honey from Sri Lankan highlands.', 130000, 1, 42, 'products/artisan-honey.jpg')
) as p(cat_slug, name, description, price_lkr, capacity, stock, image_url)
join categories c on c.slug = p.cat_slug;

-- ---------- PACKAGING OPTIONS ----------
insert into packaging_options (name, size, capacity, color, wrap_style, price_lkr, image_url) values
  ('Petite Keepsake Box', 'petite',  3, 'Soft Cream',    'Ribbon Tie',     120000, 'packaging/petite-keepsake.jpg'),
  ('Classic Signature Box','classic',5, 'Deep Charcoal', 'Magnetic Close', 200000, 'packaging/classic-signature.jpg'),
  ('Grand Celebration Box','grand',  8, 'Muted Gold',    'Silk Wrap',      320000, 'packaging/grand-celebration.jpg'),
  ('Luxe Heritage Trunk',  'luxe',  12, 'Blush Rose',    'Wax Seal',       520000, 'packaging/luxe-heritage.jpg');

-- ---------- GREETING CARDS ----------
insert into greeting_cards (name, price_lkr, image_url) values
  ('Minimal Kraft — Blank',        0,     'cards/minimal-kraft.jpg'),
  ('Floral Watercolour',           25000, 'cards/floral-watercolour.jpg'),
  ('Gold Foil "With Love"',        40000, 'cards/gold-foil.jpg'),
  ('Sage Botanical — Birthday',    30000, 'cards/sage-birthday.jpg'),
  ('Charcoal Elegance — Thank You',30000, 'cards/charcoal-thankyou.jpg');

-- ---------- DELIVERY ZONES (Colombo & suburbs) ----------
insert into delivery_zones (name, fee_lkr) values
  ('Colombo 01-15', 40000),
  ('Dehiwala / Mount Lavinia', 55000),
  ('Nugegoda / Nawala', 55000),
  ('Rajagiriya / Battaramulla', 60000),
  ('Kotte / Pita Kotte', 60000),
  ('Maharagama / Kohuwala', 70000),
  ('Moratuwa / Ratmalana', 80000),
  ('Wattala / Ja-Ela', 90000);

-- ---------- FEATURED / PRE-CURATED BOXES ----------
insert into featured_boxes (name, slug, description, base_price_lkr, image_url) values
  ('The Comfort Box',   'comfort-box',   'Candle, tea sampler & chocolates for a cosy pick-me-up.', 650000, 'featured/comfort-box.jpg'),
  ('The Pamper Box',    'pamper-box',    'Rose mist, body butter & a soy candle for self-care.',    720000, 'featured/pamper-box.jpg'),
  ('The Celebration Box','celebration-box','Preserved rose, truffles & a keepsake mug.',             890000, 'featured/celebration-box.jpg'),
  ('The Him Box',       'him-box',       'Bluetooth speaker, dark chocolate & tumbler.',             1150000, 'featured/him-box.jpg');

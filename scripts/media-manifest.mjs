/**
 * Tier 1 stock images → Supabase Storage paths.
 * Uses picsum.photos (deterministic seeds) for reliable downloads.
 */

const picsum = (seed, w = 800, h = 600) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`

export const MEDIA_BUCKET = "media"

/** @type {Array<{ path: string, source: string }>} */
export const MEDIA_FILES = [
  { path: "marketing/hero.jpg", source: picsum("gratitud-hero", 1200, 1500) },
  { path: "products/belgian-dark-truffle.jpg", source: picsum("gratitud-chocolate-truffle", 800, 600) },
  { path: "products/salted-caramel-bar.jpg", source: picsum("gratitud-caramel-bar", 800, 600) },
  { path: "products/sandalwood-candle.jpg", source: picsum("gratitud-candle-sandalwood", 800, 600) },
  { path: "products/lavender-tin-candle.jpg", source: picsum("gratitud-candle-lavender", 800, 600) },
  { path: "products/rose-face-mist.jpg", source: picsum("gratitud-skincare-mist", 800, 600) },
  { path: "products/body-butter.jpg", source: picsum("gratitud-body-butter", 800, 600) },
  { path: "products/ceramic-mug.jpg", source: picsum("gratitud-ceramic-mug", 800, 600) },
  { path: "products/travel-tumbler.jpg", source: picsum("gratitud-tumbler", 800, 600) },
  { path: "products/wireless-charger.jpg", source: picsum("gratitud-charger", 800, 600) },
  { path: "products/bluetooth-speaker.jpg", source: picsum("gratitud-speaker", 800, 600) },
  { path: "products/preserved-rose.jpg", source: picsum("gratitud-preserved-rose", 800, 600) },
  { path: "products/dried-flower-posy.jpg", source: picsum("gratitud-dried-flowers", 800, 600) },
  { path: "products/tea-sampler.jpg", source: picsum("gratitud-tea", 800, 600) },
  { path: "products/artisan-honey.jpg", source: picsum("gratitud-honey", 800, 600) },
  { path: "packaging/petite-keepsake.jpg", source: picsum("gratitud-box-petite", 900, 506) },
  { path: "packaging/classic-signature.jpg", source: picsum("gratitud-box-classic", 900, 506) },
  { path: "packaging/grand-celebration.jpg", source: picsum("gratitud-box-grand", 900, 506) },
  { path: "packaging/luxe-heritage.jpg", source: picsum("gratitud-box-luxe", 900, 506) },
  { path: "featured/comfort-box.jpg", source: picsum("gratitud-featured-comfort", 800, 600) },
  { path: "featured/pamper-box.jpg", source: picsum("gratitud-featured-pamper", 800, 600) },
  { path: "featured/celebration-box.jpg", source: picsum("gratitud-featured-celebration", 800, 600) },
  { path: "featured/him-box.jpg", source: picsum("gratitud-featured-him", 800, 600) },
  { path: "cards/minimal-kraft.jpg", source: picsum("gratitud-card-kraft", 450, 600) },
  { path: "cards/floral-watercolour.jpg", source: picsum("gratitud-card-floral", 450, 600) },
  { path: "cards/gold-foil.jpg", source: picsum("gratitud-card-gold", 450, 600) },
  { path: "cards/sage-birthday.jpg", source: picsum("gratitud-card-sage", 450, 600) },
  { path: "cards/charcoal-thankyou.jpg", source: picsum("gratitud-card-charcoal", 450, 600) },
]

/** DB image_url paths keyed by entity lookup */
export const DB_IMAGE_PATHS = {
  products: {
    "Belgian Dark Truffle Box": "products/belgian-dark-truffle.jpg",
    "Salted Caramel Bar": "products/salted-caramel-bar.jpg",
    "Soy Wax Sandalwood Candle": "products/sandalwood-candle.jpg",
    "Lavender Tin Candle": "products/lavender-tin-candle.jpg",
    "Rose Hydrating Face Mist": "products/rose-face-mist.jpg",
    "Coconut & Vanilla Body Butter": "products/body-butter.jpg",
    "Ceramic Matte Mug": "products/ceramic-mug.jpg",
    "Insulated Travel Tumbler": "products/travel-tumbler.jpg",
    "Wireless Charging Pad": "products/wireless-charger.jpg",
    "Mini Bluetooth Speaker": "products/bluetooth-speaker.jpg",
    "Preserved Rose in Glass": "products/preserved-rose.jpg",
    "Dried Flower Posy": "products/dried-flower-posy.jpg",
    "Ceylon Tea Sampler": "products/tea-sampler.jpg",
    "Artisan Honey Jar": "products/artisan-honey.jpg",
  },
  packaging: {
    "Petite Keepsake Box": "packaging/petite-keepsake.jpg",
    "Classic Signature Box": "packaging/classic-signature.jpg",
    "Grand Celebration Box": "packaging/grand-celebration.jpg",
    "Luxe Heritage Trunk": "packaging/luxe-heritage.jpg",
  },
  featured: {
    "comfort-box": "featured/comfort-box.jpg",
    "pamper-box": "featured/pamper-box.jpg",
    "celebration-box": "featured/celebration-box.jpg",
    "him-box": "featured/him-box.jpg",
  },
  greetingCards: {
    "Minimal Kraft — Blank": "cards/minimal-kraft.jpg",
    "Floral Watercolour": "cards/floral-watercolour.jpg",
    'Gold Foil "With Love"': "cards/gold-foil.jpg",
    "Sage Botanical — Birthday": "cards/sage-birthday.jpg",
    "Charcoal Elegance — Thank You": "cards/charcoal-thankyou.jpg",
  },
}

export const HERO_IMAGE_PATH = "marketing/hero.jpg"

/**
 * Download Tier 1 stock images and upload to Supabase Storage.
 * Updates catalog tables with storage paths.
 *
 * Requires .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage: npm run media:seed
 */

import path from "node:path"
import { fileURLToPath } from "node:url"
import dotenv from "dotenv"
import { createClient } from "@supabase/supabase-js"
import {
  DB_IMAGE_PATHS,
  MEDIA_BUCKET,
  MEDIA_FILES,
} from "./media-manifest.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")

dotenv.config({ path: path.join(root, ".env.local") })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  )
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets()
  if (buckets?.some((b) => b.name === MEDIA_BUCKET)) {
    console.log(`✓ Bucket "${MEDIA_BUCKET}" exists`)
    return
  }

  const { error } = await supabase.storage.createBucket(MEDIA_BUCKET, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  })

  if (error) {
    console.error("Could not create bucket:", error.message)
    process.exit(1)
  }
  console.log(`✓ Created bucket "${MEDIA_BUCKET}"`)
}

async function uploadFile({ path: storagePath, source }) {
  const res = await fetch(source)
  if (!res.ok) {
    throw new Error(`Download failed ${source}: ${res.status}`)
  }

  const buffer = Buffer.from(await res.arrayBuffer())
  const contentType = res.headers.get("content-type") ?? "image/jpeg"

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(storagePath, buffer, {
      contentType,
      upsert: true,
      cacheControl: "31536000",
    })

  if (error) throw new Error(`Upload ${storagePath}: ${error.message}`)
  console.log(`  ↑ ${storagePath}`)
}

async function updateTable(table, column, keyColumn, mapping) {
  for (const [key, imagePath] of Object.entries(mapping)) {
    const { error } = await supabase
      .from(table)
      .update({ [column]: imagePath })
      .eq(keyColumn, key)

    if (error) {
      console.warn(`  ⚠ ${table} "${key}": ${error.message}`)
    } else {
      console.log(`  · ${table}.${keyColumn}=${key}`)
    }
  }
}

async function main() {
  console.log("→ Ensuring storage bucket…")
  await ensureBucket()

  console.log(`→ Uploading ${MEDIA_FILES.length} images…`)
  for (const file of MEDIA_FILES) {
    await uploadFile(file)
  }

  console.log("→ Updating database image_url paths…")
  await updateTable("products", "image_url", "name", DB_IMAGE_PATHS.products)
  await updateTable(
    "packaging_options",
    "image_url",
    "name",
    DB_IMAGE_PATHS.packaging
  )
  await updateTable(
    "featured_boxes",
    "image_url",
    "slug",
    DB_IMAGE_PATHS.featured
  )
  await updateTable(
    "greeting_cards",
    "image_url",
    "name",
    DB_IMAGE_PATHS.greetingCards
  )

  const sample = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(MEDIA_FILES[0].path)
  console.log("\nDone. Example URL:")
  console.log(sample.data.publicUrl)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

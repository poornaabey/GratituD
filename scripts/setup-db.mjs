/**
 * Apply GratituD schema + seed to a remote Supabase project.
 *
 * Requires in .env.local:
 *   SUPABASE_DB_PASSWORD — the postgres password you set when creating the project
 *
 * Usage: npm run db:setup
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import dotenv from "dotenv"
import pg from "pg"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")

dotenv.config({ path: path.join(root, ".env.local") })

const PROJECT_REF = "vqqljzydkcuvgzxauowt"
const password = process.env.SUPABASE_DB_PASSWORD

if (!password) {
  console.error(
    "Missing SUPABASE_DB_PASSWORD in .env.local\n" +
      "Add the database password from when you created the Supabase project, then run:\n" +
      "  npm run db:setup"
  )
  process.exit(1)
}

const connectionString =
  process.env.SUPABASE_DB_URL ??
  `postgresql://postgres:${encodeURIComponent(password)}@db.${PROJECT_REF}.supabase.co:5432/postgres`

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
})

async function runFile(label, filePath) {
  const sql = fs.readFileSync(filePath, "utf8")
  console.log(`→ Running ${label}…`)
  await client.query(sql)
  console.log(`✓ ${label} complete`)
}

async function verify() {
  const tables = [
    "categories",
    "products",
    "packaging_options",
    "greeting_cards",
    "delivery_zones",
  ]
  for (const table of tables) {
    const { rows } = await client.query(`select count(*)::int as n from ${table}`)
    console.log(`  ${table}: ${rows[0].n} rows`)
  }
}

async function main() {
  console.log(`Connecting to Supabase (${PROJECT_REF})…`)
  await client.connect()

  try {
    await runFile(
      "migration (0001_init.sql)",
      path.join(root, "supabase/migrations/0001_init.sql")
    )
    await runFile("seed (seed.sql)", path.join(root, "supabase/seed.sql"))
    console.log("\nVerification:")
    await verify()
    console.log("\nDatabase setup finished successfully.")
  } finally {
    await client.end()
  }
}

main().catch((err) => {
  console.error("\nSetup failed:", err.message)
  process.exit(1)
})

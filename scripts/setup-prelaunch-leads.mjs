import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnvFile(name) {
  const path = resolve(root, name);
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

function projectRefFromUrl(url) {
  try {
    return new URL(url).hostname.split(".")[0] ?? "";
  } catch {
    return "";
  }
}

function buildDatabaseUrl() {
  if (process.env["SUPABASE_DB_URL"]) return process.env["SUPABASE_DB_URL"];
  if (process.env["DATABASE_URL"]) return process.env["DATABASE_URL"];

  const password = process.env["SUPABASE_DB_PASSWORD"];
  const supabaseUrl = process.env["SUPABASE_URL"] || process.env["NEXT_PUBLIC_SUPABASE_URL"];
  if (!password || !supabaseUrl) return null;

  const ref = projectRefFromUrl(supabaseUrl);
  if (!ref) return null;

  const encoded = encodeURIComponent(password);
  return `postgresql://postgres:${encoded}@db.${ref}.supabase.co:5432/postgres`;
}

async function main() {
  const dbUrl = buildDatabaseUrl();
  if (!dbUrl) {
    console.error(
      [
        "Missing database connection.",
        "Add one of these to .env.local:",
        "  SUPABASE_DB_URL=postgresql://postgres:YOUR_PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres",
        "  SUPABASE_DB_PASSWORD=your_database_password  (uses SUPABASE_URL project ref)",
        "",
        "Find the password in Supabase → Project Settings → Database → Database password.",
      ].join("\n"),
    );
    process.exit(1);
  }

  const migrationFiles = [
    "supabase/migrations/20260813120000_prelaunch_leads_setup.sql",
    "supabase/migrations/20260813130000_customer_product_and_early_access.sql",
  ];
  const migration = migrationFiles
    .map((file) => readFileSync(resolve(root, file), "utf8"))
    .join("\n\n");

  const sql = postgres(dbUrl, { ssl: "require", max: 1 });
  try {
    await sql.unsafe(migration);
    console.log("✓ Customer tables are ready in Supabase (prelaunch_leads + early_access_subscribers).");
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((error) => {
  console.error("Setup failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});

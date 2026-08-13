import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

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

async function main() {
  const url = process.env["SUPABASE_URL"] || process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !key) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }

  const leadsPath = resolve(root, "data/customer-leads.json");
  if (!existsSync(leadsPath)) {
    console.log("No local leads file to import.");
    return;
  }

  const leads = JSON.parse(readFileSync(leadsPath, "utf8"));
  if (!Array.isArray(leads) || leads.length === 0) {
    console.log("No local leads to import.");
    return;
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error: probeError } = await supabase.from("prelaunch_leads").select("id").limit(1);
  if (probeError) {
    console.error("prelaunch_leads table is not ready:", probeError.message);
    console.error("Run npm run db:setup-leads first, or paste the SQL migration in Supabase SQL Editor.");
    process.exit(1);
  }

  let imported = 0;
  for (const lead of leads) {
    const { error } = await supabase.from("prelaunch_leads").upsert(
      {
        id: lead.id,
        full_name: lead.fullName,
        mobile: lead.mobile,
        email: lead.email,
        products: lead.products ?? [],
        source: lead.source ?? "website",
        whatsapp_optin: true,
        marketing_consent: true,
        created_at: lead.createdAt,
      },
      { onConflict: "mobile", ignoreDuplicates: true },
    );
    if (error) {
      console.warn(`Skipped ${lead.email ?? lead.mobile}: ${error.message}`);
      continue;
    }
    imported += 1;
  }

  console.log(`✓ Imported ${imported} lead(s) into Supabase.`);
}

main().catch((error) => {
  console.error("Seed failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const MIGRATIONS = [
  "supabase/migrations/20260813120000_prelaunch_leads_setup.sql",
  "supabase/migrations/20260813130000_customer_product_and_early_access.sql",
];

export function getLeadsSetupSql() {
  return MIGRATIONS.map((file) => readFileSync(resolve(process.cwd(), file), "utf8").trim()).join(
    "\n\n",
  );
}

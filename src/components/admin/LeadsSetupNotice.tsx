import { getLeadsSetupSql } from "@/lib/leads-setup.server";
import { cn } from "@/lib/utils";

export function LeadsSetupNotice({ className }: { className?: string }) {
  const sql = getLeadsSetupSql();

  return (
    <div
      className={cn(
        "rounded-3xl border border-amber-200 bg-amber-50 px-5 py-5 text-sm text-amber-950",
        className,
      )}
    >
      <p className="font-semibold">Supabase tables not set up yet</p>
      <p className="mt-2 leading-relaxed">
        Run this once to create <code className="text-xs">prelaunch_leads</code> and{" "}
        <code className="text-xs">early_access_subscribers</code>:
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-5">
        <li>Open Supabase → SQL Editor</li>
        <li>Paste the SQL below and click Run</li>
        <li>Refresh this page</li>
      </ol>
      <p className="mt-4 text-xs text-amber-900/80">
        Or add <code>SUPABASE_DB_PASSWORD</code> to <code>.env.local</code> and run{" "}
        <code>npm run db:setup-leads</code>
      </p>
      <pre className="mt-4 max-h-64 overflow-auto rounded-2xl border border-amber-200/80 bg-white p-4 text-xs leading-relaxed text-foreground">
        {sql.trim()}
      </pre>
    </div>
  );
}

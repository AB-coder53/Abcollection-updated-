import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { CustomersTable } from "@/components/admin/CustomersTable";
import { EarlyAccessTable } from "@/components/admin/EarlyAccessTable";
import { LeadsSetupNotice } from "@/components/admin/LeadsSetupNotice";
import { getAdminSession } from "@/lib/admin-auth.server";
import { getEarlyAccessSubscribers, isEarlyAccessTableReady } from "@/lib/early-access-service";
import { getCustomerLeads, isLeadsTableReady } from "@/lib/leads";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Admin Customers",
  description: "View AB Collection reserve interest and early access sign-ups",
  path: "/admin/customers",
  noIndex: true,
});

export default async function AdminCustomersPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const leadsReady = await isLeadsTableReady();
  const earlyAccessReady = await isEarlyAccessTableReady();
  const tableReady = leadsReady && earlyAccessReady;

  let customers: Awaited<ReturnType<typeof getCustomerLeads>> = [];
  let subscribers: Awaited<ReturnType<typeof getEarlyAccessSubscribers>> = [];
  let loadError = "";

  if (tableReady) {
    try {
      [customers, subscribers] = await Promise.all([
        getCustomerLeads(),
        getEarlyAccessSubscribers(),
      ]);
    } catch (error) {
      loadError = error instanceof Error ? error.message : "Could not load customer submissions.";
    }
  }

  return (
    <AdminShell username={session.username}>
      <div>
        <h1 className="font-display text-3xl font-bold">Customers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Reserve interest orders and early access emails for collection updates.
        </p>
      </div>

      {!tableReady ? <LeadsSetupNotice className="mt-6" /> : null}

      {loadError ? (
        <p className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {loadError}
        </p>
      ) : null}

      {tableReady && !loadError ? (
        <div className="mt-8 space-y-10">
          <section>
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold">Reserve Interest</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Customers who reserved a specific product ({customers.length})
                </p>
              </div>
            </div>
            <CustomersTable customers={customers} />
          </section>

          <section>
            <div className="mb-4">
              <h2 className="font-display text-xl font-bold">Early Access Emails</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Collection update list from the homepage email form ({subscribers.length})
              </p>
            </div>
            <EarlyAccessTable subscribers={subscribers} />
          </section>
        </div>
      ) : null}
    </AdminShell>
  );
}

import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { StockManagementTable } from "@/components/admin/StockManagementTable";
import { StockSetupNotice } from "@/components/admin/StockSetupNotice";
import { getAdminSession } from "@/lib/admin-auth.server";
import { getProducts } from "@/lib/catalog.server";
import { buildPageMetadata } from "@/lib/seo";
import { isStockColumnReady } from "@/lib/stock.server";

export const metadata = buildPageMetadata({
  title: "Stock Management",
  description: "Update and manage product inventory for AB Collection",
  path: "/admin/stock",
  noIndex: true,
});

export default async function AdminStockPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const stockReady = await isStockColumnReady();
  const products = stockReady ? await getProducts() : [];

  return (
    <AdminShell username={session.username}>
      <h1 className="font-display text-3xl font-bold">Stock Management</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Set how many units are available for each product. When stock is tracked, successful
        customer orders automatically reduce the count by one. Clear stock to stop tracking
        (unlimited inventory).
      </p>

      {!stockReady ? (
        <div className="mt-8">
          <StockSetupNotice />
        </div>
      ) : (
        <div className="mt-8">
          <StockManagementTable products={products} />
        </div>
      )}
    </AdminShell>
  );
}

"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { DangerButton } from "@/components/admin/AdminFields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Product } from "@/lib/catalog-types";
import { cn } from "@/lib/utils";

type RowState = {
  value: string;
  saving: boolean;
  error: string;
};

function stockLabel(stockCount: number | null | undefined) {
  if (stockCount == null) return "Not tracked";
  if (stockCount <= 0) return "Out of stock";
  if (stockCount <= 5) return "Low stock";
  return "In stock";
}

export function StockManagementTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<Record<string, RowState>>(() =>
    Object.fromEntries(
      products.map((product) => [
        product.id,
        {
          value:
            product.stockCount === null || product.stockCount === undefined
              ? ""
              : String(product.stockCount),
          saving: false,
          error: "",
        },
      ]),
    ),
  );

  const setRow = (id: string, patch: Partial<RowState>) => {
    setRows((prev) => ({
      ...prev,
      [id]: { ...prev[id]!, ...patch },
    }));
  };

  const saveStock = async (productId: string) => {
    const row = rows[productId];
    if (!row) return;

    const trimmed = row.value.trim();
    const stockCount = trimmed === "" ? null : Math.max(0, Number(trimmed) || 0);
    if (trimmed !== "" && Number.isNaN(Number(trimmed))) {
      setRow(productId, { error: "Enter a valid number or leave empty." });
      return;
    }

    setRow(productId, { saving: true, error: "" });
    try {
      const response = await fetch(`/api/admin/stock/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stockCount }),
      });
      const data = (await response.json()) as { error?: string; stockCount?: number | null };
      if (!response.ok) {
        throw new Error(data.error ?? "Update failed");
      }
      setRow(productId, {
        value: data.stockCount == null ? "" : String(data.stockCount),
        saving: false,
        error: "",
      });
      router.refresh();
    } catch (err) {
      setRow(productId, {
        saving: false,
        error: err instanceof Error ? err.message : "Update failed",
      });
    }
  };

  const clearTracking = async (productId: string) => {
    setRow(productId, { saving: true, error: "" });
    try {
      const response = await fetch(`/api/admin/stock/${productId}`, { method: "DELETE" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Could not clear stock");
      }
      setRow(productId, { value: "", saving: false, error: "" });
      router.refresh();
    } catch (err) {
      setRow(productId, {
        saving: false,
        error: err instanceof Error ? err.message : "Could not clear stock",
      });
    }
  };

  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-white px-6 py-12 text-center text-sm text-muted-foreground">
        No products in the catalog yet. Add products first, then set stock here.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className="px-4 py-3 font-semibold">Product</th>
            <th className="hidden px-4 py-3 font-semibold sm:table-cell">Current</th>
            <th className="px-4 py-3 font-semibold">Update stock</th>
            <th className="px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const row = rows[product.id] ?? { value: "", saving: false, error: "" };
            const status = stockLabel(product.stockCount);

            return (
              <tr key={product.id} className="border-b border-border align-top last:border-0">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt=""
                      className="size-12 rounded-lg object-cover object-top"
                    />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.id}</p>
                      <p
                        className={cn(
                          "mt-1 text-xs font-semibold uppercase tracking-wide",
                          status === "Out of stock" && "text-destructive",
                          status === "Low stock" && "text-amber-700",
                          status === "In stock" && "text-teal",
                          status === "Not tracked" && "text-muted-foreground",
                        )}
                      >
                        {status}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-4 sm:table-cell">
                  {product.stockCount == null ? "—" : product.stockCount}
                </td>
                <td className="px-4 py-4">
                  <div className="max-w-[10rem]">
                    <Input
                      type="number"
                      min={0}
                      inputMode="numeric"
                      placeholder="Unlimited"
                      value={row.value}
                      disabled={row.saving}
                      onChange={(event) =>
                        setRow(product.id, { value: event.target.value, error: "" })
                      }
                      className="h-10 rounded-xl"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Leave empty for unlimited inventory.
                    </p>
                    {row.error ? (
                      <p className="mt-1 text-xs text-destructive">{row.error}</p>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      disabled={row.saving}
                      className="rounded-full bg-teal text-teal-foreground hover:bg-teal/90"
                      onClick={() => void saveStock(product.id)}
                    >
                      {row.saving ? <Loader2 className="size-4 animate-spin" /> : null}
                      Save
                    </Button>
                    <DangerButton label="Clear" onConfirm={() => void clearTracking(product.id)} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

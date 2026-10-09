import "server-only";

import { getSupabaseWriteClient } from "@/lib/supabase-catalog.server";

export class InsufficientStockError extends Error {
  constructor(message = "This product is out of stock.") {
    super(message);
    this.name = "InsufficientStockError";
  }
}

export async function getTrackedStock(productId: string): Promise<number | null> {
  const client = getSupabaseWriteClient();
  const { data, error } = await client
    .from("products")
    .select("stock_count")
    .eq("id", productId)
    .maybeSingle();

  if (error) {
    if (isMissingStockColumn(error)) return null;
    throw new Error(error.message);
  }

  if (!data || data.stock_count === null || data.stock_count === undefined) {
    return null;
  }

  return data.stock_count;
}

export async function assertProductInStock(productId: string, quantity = 1) {
  const stock = await getTrackedStock(productId);
  if (stock === null) return;
  if (stock < quantity) {
    throw new InsufficientStockError();
  }
}

export async function decrementProductStock(
  productId: string,
  quantity = 1,
): Promise<number | null> {
  const client = getSupabaseWriteClient();
  const stock = await getTrackedStock(productId);
  if (stock === null) return null;
  if (stock < quantity) throw new InsufficientStockError();

  const next = stock - quantity;
  const { error } = await client.from("products").update({ stock_count: next }).eq("id", productId);

  if (error) throw new Error(error.message);
  return next;
}

export async function isStockColumnReady() {
  const { error } = await getSupabaseWriteClient().from("products").select("stock_count").limit(1);
  return !error;
}

export async function setProductStock(productId: string, stockCount: number | null) {
  const client = getSupabaseWriteClient();
  const { data, error } = await client
    .from("products")
    .update({ stock_count: stockCount })
    .eq("id", productId)
    .select("id, stock_count")
    .maybeSingle();

  if (error) {
    if (isMissingStockColumn(error)) {
      throw new Error(
        "Stock column is not set up yet. Run supabase/migrations/20260916140000_product_stock_count.sql in Supabase.",
      );
    }
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Product not found.");
  }

  return data.stock_count;
}

export const STOCK_SETUP_SQL = `-- Add stock tracking to products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS stock_count INTEGER;

COMMENT ON COLUMN public.products.stock_count IS
  'Units in stock. NULL means inventory is not enforced.';`;

export function getStockSetupSql() {
  return STOCK_SETUP_SQL;
}

function isMissingStockColumn(error: { message?: string; code?: string }) {
  const message = error.message ?? "";
  return message.includes("stock_count") || error.code === "42703";
}

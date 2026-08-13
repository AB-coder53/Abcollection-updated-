import "server-only";

import { z } from "zod";

import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const productInterestSchema = z.object({
  id: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1).max(120),
  price: z.string().trim().min(1).max(40),
  fabric: z.string().trim().min(1).max(120),
  image: z.string().trim().min(1).max(500),
  color: z.string().trim().min(1).max(40).optional(),
  size: z.string().trim().min(1).max(10).optional(),
});

export const interestSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  product: productInterestSchema.optional(),
});

export type InterestInput = z.infer<typeof interestSchema>;
export type ProductInterest = z.infer<typeof productInterestSchema>;

export type CustomerLead = {
  id: string;
  fullName: string;
  email: string | null;
  mobile: string;
  products: string[];
  productDetails: ProductInterest | null;
  preferredColor: string | null;
  preferredSize: string | null;
  source: string | null;
  createdAt: string;
};

function supabaseErrorMessage(error: { message?: string; code?: string }) {
  const message = error.message ?? "Unknown Supabase error";
  if (
    message.includes("Could not find the table") ||
    message.includes("prelaunch_leads") ||
    message.includes("product_details")
  ) {
    return "Customer database is not set up yet. Run: npm run db:setup-leads";
  }
  return message;
}

function parseProductDetails(value: unknown): ProductInterest | null {
  if (!value || typeof value !== "object") return null;
  const parsed = productInterestSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export async function registerInterest(data: InterestInput) {
  const colorLabel = data.product?.color;
  const productLabel = data.product
    ? colorLabel
      ? `${data.product.name} (${colorLabel})`
      : data.product.name
    : "General Interest";
  const products = [productLabel];
  const discountCode = `AB10-${data.mobile.slice(-4)}${Math.random()
    .toString(36)
    .slice(2, 5)
    .toUpperCase()}`;

  const { data: existing, error: lookupError } = await supabaseAdmin
    .from("prelaunch_leads")
    .select("id")
    .or(`mobile.eq.${data.mobile},email.eq.${data.email}`)
    .limit(1)
    .maybeSingle();

  if (lookupError) {
    console.error("[prelaunch_leads] lookup failed", lookupError.message);
    throw new Error(supabaseErrorMessage(lookupError));
  }

  if (existing) {
    return { ok: true as const, duplicate: true as const };
  }

  const { error } = await supabaseAdmin.from("prelaunch_leads").insert({
    full_name: data.fullName,
    mobile: data.mobile,
    email: data.email,
    products,
    product_details: data.product ?? null,
    preferred_color: data.product?.color ?? null,
    preferred_size: data.product?.size ?? null,
    whatsapp_optin: true,
    marketing_consent: true,
    discount_code: discountCode,
    source: data.product ? "product" : "website",
  });

  if (error) {
    console.error("[prelaunch_leads] insert failed", error.message);
    if (error.code === "23505") {
      return { ok: true as const, duplicate: true as const };
    }
    throw new Error(supabaseErrorMessage(error));
  }

  return { ok: true as const, duplicate: false as const, discountCode };
}

export async function getCustomerLeads(): Promise<CustomerLead[]> {
  const { data, error } = await supabaseAdmin
    .from("prelaunch_leads")
    .select(
      "id, full_name, email, mobile, products, product_details, preferred_color, preferred_size, source, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[prelaunch_leads] fetch failed", error.message);
    throw new Error(supabaseErrorMessage(error));
  }

  return (data ?? []).map((row) => {
    const productDetails = parseProductDetails(row.product_details);
    return {
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      mobile: row.mobile,
      products: row.products ?? [],
      productDetails,
      preferredColor: productDetails?.color ?? row.preferred_color,
      preferredSize: productDetails?.size ?? row.preferred_size,
      source: row.source,
      createdAt: row.created_at,
    };
  });
}

export async function isLeadsTableReady() {
  const { error } = await supabaseAdmin.from("prelaunch_leads").select("id").limit(1);
  return !error;
}

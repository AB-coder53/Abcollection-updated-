import "server-only";

import { randomUUID } from "crypto";

import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const PRODUCT_UPLOADS_BUCKET = "product-uploads";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function extensionForMime(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return "jpg";
}

export async function uploadProductImage(file: File): Promise<string> {
  if (!ALLOWED.has(file.type)) {
    throw new Error("Only JPG, PNG, WEBP or GIF allowed.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File must be under 5MB.");
  }

  const ext = extensionForMime(file.type);
  const objectPath = `uploads/${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from(PRODUCT_UPLOADS_BUCKET)
    .upload(objectPath, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("[supabase-storage/upload]", error.message);
    if (error.message.includes("Bucket not found") || error.message.includes("product-uploads")) {
      throw new Error(
        "Image storage is not set up yet. Run supabase/migrations/20260820130000_product_uploads_storage.sql in Supabase.",
      );
    }
    throw new Error(error.message || "Upload failed.");
  }

  const { data } = supabaseAdmin.storage.from(PRODUCT_UPLOADS_BUCKET).getPublicUrl(objectPath);
  return data.publicUrl;
}

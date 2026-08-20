import { NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/admin-auth.server";
import { uploadProductImage } from "@/lib/supabase-storage.server";

export async function POST(request: Request) {
  try {
    await requireAdminSession();
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const url = await uploadProductImage(file);
    return NextResponse.json({ url });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Upload failed.";
    console.error("[admin/upload]", error);
    const status = message.includes("allowed") || message.includes("under 5MB") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

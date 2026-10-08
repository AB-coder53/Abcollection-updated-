import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { InsufficientStockError, interestSchema, registerInterest } from "@/lib/leads";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const data = interestSchema.parse(body);
    const result = await registerInterest(data);
    if (!result.duplicate) {
      revalidatePath("/");
      revalidatePath("/collection", "layout");
      revalidatePath("/admin/products");
    }
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof InsufficientStockError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    if (error instanceof ZodError) {
      const message = error.issues[0]?.message ?? "Invalid registration data.";
      return NextResponse.json({ error: message }, { status: 400 });
    }
    const message =
      error instanceof Error
        ? error.message
        : "We couldn't save your registration. Please try again.";
    console.error("[leads]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

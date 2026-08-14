import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { requireAdminSession } from "@/lib/admin-auth.server";
import { adminCustomerSchema, createCustomerLead } from "@/lib/leads";

export async function POST(request: Request) {
  try {
    await requireAdminSession();
    const body: unknown = await request.json();
    const data = adminCustomerSchema.parse(body);
    const customer = await createCustomerLead(data);
    return NextResponse.json({ customer });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid customer data" },
        { status: 400 },
      );
    }
    const message = error instanceof Error ? error.message : "Could not create customer";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

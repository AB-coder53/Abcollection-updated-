import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { requireAdminSession } from "@/lib/admin-auth.server";
import {
  adminCustomerSchema,
  deleteCustomerLead,
  getCustomerLeadById,
  updateCustomerLead,
} from "@/lib/leads";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: Request, ctx: Ctx) {
  try {
    await requireAdminSession();
    const { id } = await ctx.params;
    const customer = await getCustomerLeadById(id);
    if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ customer });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Could not load customer";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: Request, ctx: Ctx) {
  try {
    await requireAdminSession();
    const { id } = await ctx.params;
    const body: unknown = await request.json();
    const data = adminCustomerSchema.parse(body);
    const customer = await updateCustomerLead(id, data);
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
    const message = error instanceof Error ? error.message : "Could not update customer";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_: Request, ctx: Ctx) {
  try {
    await requireAdminSession();
    const { id } = await ctx.params;
    await deleteCustomerLead(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Could not delete customer";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { requireAdminSession } from "@/lib/admin-auth.server";
import {
  deleteEarlyAccessSubscriber,
  earlyAccessSchema,
  updateEarlyAccessSubscriber,
} from "@/lib/early-access-service";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(request: Request, ctx: Ctx) {
  try {
    await requireAdminSession();
    const { id } = await ctx.params;
    const body: unknown = await request.json();
    const data = earlyAccessSchema.parse(body);
    const subscriber = await updateEarlyAccessSubscriber(id, data.email);
    return NextResponse.json({ subscriber });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid email" },
        { status: 400 },
      );
    }
    const message = error instanceof Error ? error.message : "Could not update subscriber";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_: Request, ctx: Ctx) {
  try {
    await requireAdminSession();
    const { id } = await ctx.params;
    await deleteEarlyAccessSubscriber(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Could not delete subscriber";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

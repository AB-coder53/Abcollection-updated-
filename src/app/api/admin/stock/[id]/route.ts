import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { ZodError, z } from "zod";

import { requireAdminSession } from "@/lib/admin-auth.server";
import { setProductStock } from "@/lib/stock.server";

const stockUpdateSchema = z.object({
  stockCount: z.number().int().min(0).max(999_999).nullable(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    await requireAdminSession();
    const { id } = await ctx.params;
    const body: unknown = await request.json();
    const { stockCount } = stockUpdateSchema.parse(body);
    const updated = await setProductStock(id, stockCount);

    revalidatePath("/");
    revalidatePath("/collection", "layout");
    revalidatePath("/admin/products");
    revalidatePath("/admin/stock");

    return NextResponse.json({ productId: id, stockCount: updated });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid stock value" },
        { status: 400 },
      );
    }
    const message = error instanceof Error ? error.message : "Could not update stock";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_: Request, ctx: Ctx) {
  try {
    await requireAdminSession();
    const { id } = await ctx.params;
    await setProductStock(id, null);

    revalidatePath("/");
    revalidatePath("/collection", "layout");
    revalidatePath("/admin/products");
    revalidatePath("/admin/stock");

    return NextResponse.json({ productId: id, stockCount: null });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Could not clear stock";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

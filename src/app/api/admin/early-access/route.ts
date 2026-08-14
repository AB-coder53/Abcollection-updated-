import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { requireAdminSession } from "@/lib/admin-auth.server";
import { createEarlyAccessSubscriber, earlyAccessSchema } from "@/lib/early-access-service";

export async function POST(request: Request) {
  try {
    await requireAdminSession();
    const body: unknown = await request.json();
    const data = earlyAccessSchema.parse(body);
    const subscriber = await createEarlyAccessSubscriber(data.email);
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
    const message = error instanceof Error ? error.message : "Could not add subscriber";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

import "server-only";

import { z } from "zod";

import type { EarlyAccessResult } from "@/lib/api-types";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const earlyAccessSchema = z.object({
  email: z.string().trim().min(3).max(255).email(),
});

export type EarlyAccessSubscriber = {
  id: string;
  email: string;
  createdAt: string;
};

export type { EarlyAccessResult };

export async function joinEarlyAccessList(
  data: z.infer<typeof earlyAccessSchema>,
): Promise<EarlyAccessResult> {
  const email = data.email.trim().toLowerCase();

  const { data: existing, error: lookupError } = await supabaseAdmin
    .from("early_access_subscribers")
    .select("id")
    .eq("email", email)
    .limit(1)
    .maybeSingle();

  if (lookupError) {
    console.error("[early_access_subscribers] lookup failed", lookupError.message);
    throw new Error("We couldn't save your email right now. Please try again.");
  }

  if (existing) {
    return { status: "existing", email };
  }

  const { error } = await supabaseAdmin.from("early_access_subscribers").insert({ email });

  if (error) {
    console.error("[early_access_subscribers] insert failed", error.message);
    if (error.code === "23505") {
      return { status: "existing", email };
    }
    throw new Error("We couldn't save your email right now. Please try again.");
  }

  return { status: "created", email };
}

export async function getEarlyAccessSubscribers(): Promise<EarlyAccessSubscriber[]> {
  const { data, error } = await supabaseAdmin
    .from("early_access_subscribers")
    .select("id, email, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[early_access_subscribers] fetch failed", error.message);
    throw new Error("Could not load early access subscribers.");
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    email: row.email,
    createdAt: row.created_at,
  }));
}

export async function isEarlyAccessTableReady() {
  const { error } = await supabaseAdmin.from("early_access_subscribers").select("id").limit(1);
  return !error;
}

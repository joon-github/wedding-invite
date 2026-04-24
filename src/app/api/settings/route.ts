import { verifyAdmin } from "@/lib/admin";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data } = await supabase
    .from("site_settings")
    .select("key, value");

  const settings: Record<string, boolean> = {};
  for (const row of data ?? []) {
    settings[row.key] = row.value === true || row.value === "true";
  }

  return Response.json({ settings });
}

export async function PUT(request: Request) {
  if (!verifyAdmin(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const key = body?.key;
  const value = body?.value;

  if (typeof key !== "string" || typeof value !== "boolean") {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() });

  if (error) {
    return Response.json({ error: "Failed to update" }, { status: 500 });
  }

  return Response.json({ ok: true });
}

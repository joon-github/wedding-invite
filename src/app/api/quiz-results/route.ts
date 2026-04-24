import { verifyAdmin } from "@/lib/admin";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!verifyAdmin(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data } = await supabase
    .from("quiz_answers")
    .select("id, created_at, name, score, correct")
    .order("created_at", { ascending: false });

  return Response.json({ results: data ?? [] });
}

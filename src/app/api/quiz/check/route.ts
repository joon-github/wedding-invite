import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const questionId = body?.questionId;
  const selected = body?.selected;

  if (typeof questionId !== "number" || typeof selected !== "number") {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const { data } = await supabase
    .from("quiz_questions")
    .select("answer")
    .eq("id", questionId)
    .single();

  if (!data) {
    return Response.json({ error: "Question not found" }, { status: 404 });
  }

  return Response.json({ answer: data.answer });
}

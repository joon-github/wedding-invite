import { verifyAdmin } from "@/lib/admin";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!verifyAdmin(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data } = await supabase
    .from("quiz_questions")
    .select("*")
    .order("sort_order", { ascending: true });

  return Response.json({ questions: data ?? [] });
}

export async function POST(request: Request) {
  if (!verifyAdmin(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.question || !Array.isArray(body?.options) || body.options.length < 2) {
    return Response.json({ error: "Invalid question data" }, { status: 400 });
  }

  const { data: maxRow } = await supabase
    .from("quiz_questions")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const nextOrder = (maxRow?.sort_order ?? 0) + 1;

  const { data, error } = await supabase
    .from("quiz_questions")
    .insert({
      question: body.question,
      image: body.image || null,
      options: body.options,
      answer: body.answer ?? 0,
      sort_order: nextOrder,
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: "Failed to create" }, { status: 500 });
  }

  return Response.json({ question: data });
}

export async function PUT(request: Request) {
  if (!verifyAdmin(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.id) {
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (body.question !== undefined) updates.question = body.question;
  if (body.image !== undefined) updates.image = body.image || null;
  if (body.options !== undefined) updates.options = body.options;
  if (body.answer !== undefined) updates.answer = body.answer;
  if (body.sort_order !== undefined) updates.sort_order = body.sort_order;

  const { error } = await supabase
    .from("quiz_questions")
    .update(updates)
    .eq("id", body.id);

  if (error) {
    return Response.json({ error: "Failed to update" }, { status: 500 });
  }

  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!verifyAdmin(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.id) {
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("quiz_questions")
    .delete()
    .eq("id", body.id);

  if (error) {
    return Response.json({ error: "Failed to delete" }, { status: 500 });
  }

  return Response.json({ ok: true });
}

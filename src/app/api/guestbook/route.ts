import { verifyAdmin } from "@/lib/admin";
import { supabase } from "@/lib/supabase";

const MAX_NAME_LENGTH = 20;
const MAX_MESSAGE_LENGTH = 140;

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabase
    .from("guestbook")
    .select("id, created_at, name, content")
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ messages: [] }, { status: 500 });
  }

  const messages = (data ?? []).map((row) => ({
    id: String(row.id),
    name: row.name ?? "",
    message: row.content ?? "",
    createdAt: row.created_at,
  }));

  return Response.json({ messages });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = sanitizeText(body?.name, MAX_NAME_LENGTH);
  const message = sanitizeText(body?.message, MAX_MESSAGE_LENGTH);
  const website = sanitizeText(body?.website, 80);

  if (website) {
    return Response.json({ messages: [] });
  }

  if (!name || !message) {
    return Response.json(
      { messages: [], error: "Name and message are required" },
      { status: 400 },
    );
  }

  const { error: insertError } = await supabase
    .from("guestbook")
    .insert({ name, content: message });

  if (insertError) {
    return Response.json(
      { messages: [], error: "Failed to save message" },
      { status: 500 },
    );
  }

  const { data } = await supabase
    .from("guestbook")
    .select("id, created_at, name, content")
    .order("created_at", { ascending: false });

  const messages = (data ?? []).map((row) => ({
    id: String(row.id),
    name: row.name ?? "",
    message: row.content ?? "",
    createdAt: row.created_at,
  }));

  return Response.json({ messages });
}

export async function DELETE(request: Request) {
  if (!verifyAdmin(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const id = body?.id;

  if (!id) {
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("guestbook")
    .delete()
    .eq("id", id);

  if (error) {
    return Response.json({ error: "Delete failed" }, { status: 500 });
  }

  return Response.json({ ok: true });
}

function sanitizeText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

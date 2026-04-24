import { del, list, put } from "@vercel/blob";
import { verifyAdmin } from "@/lib/admin";
import { isFeatureEnabled } from "@/lib/settings";

export const dynamic = "force-dynamic";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

export async function GET() {
  const { blobs } = await list({ prefix: "photos/" });

  const photos = blobs.map((blob) => ({
    url: blob.url,
    uploadedAt: blob.uploadedAt,
    pathname: blob.pathname,
  }));

  return Response.json({ photos });
}

export async function POST(request: Request) {
  if (!(await isFeatureEnabled("show_photo_upload"))) {
    return Response.json({ error: "Photo upload is disabled" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return Response.json({ error: "Invalid file type" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return Response.json({ error: "File too large (max 10MB)" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `photos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const blob = await put(filename, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return Response.json({ url: blob.url });
}

export async function DELETE(request: Request) {
  if (!verifyAdmin(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const url = body?.url;

  if (!url || typeof url !== "string") {
    return Response.json({ error: "URL is required" }, { status: 400 });
  }

  await del(url);
  return Response.json({ ok: true });
}

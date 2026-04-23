const MAX_NAME_LENGTH = 20;
const MAX_MESSAGE_LENGTH = 140;

type GuestbookMessage = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

type AppsScriptResponse = {
  ok?: boolean;
  messages?: GuestbookMessage[];
  error?: string;
};

export const dynamic = "force-dynamic";

export async function GET() {
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

  if (!scriptUrl) {
    return Response.json({ messages: [], setupRequired: true });
  }

  const data = await callAppsScript(scriptUrl, "GET");

  return Response.json({ messages: data.messages ?? [] });
}

export async function POST(request: Request) {
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

  if (!scriptUrl) {
    return Response.json(
      { messages: [], setupRequired: true, error: "Guestbook is not configured" },
      { status: 503 },
    );
  }

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

  const data = await callAppsScript(scriptUrl, "POST", {
    name,
    message,
    secret: process.env.GUESTBOOK_SECRET ?? "",
  });

  return Response.json({ messages: data.messages ?? [] });
}

async function callAppsScript(
  scriptUrl: string,
  method: "GET" | "POST",
  body?: Record<string, string>,
) {
  const secret = process.env.GUESTBOOK_SECRET ?? "";
  const url = new URL(scriptUrl);

  if (method === "GET") {
    url.searchParams.set("secret", secret);
  }

  const response = await fetch(url, {
    method,
    headers:
      method === "POST" ? { "Content-Type": "text/plain;charset=utf-8" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as AppsScriptResponse;

  if (!response.ok || data.ok === false) {
    throw new Error(data.error ?? "Apps Script request failed");
  }

  return data;
}

function sanitizeText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

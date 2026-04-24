export function verifyAdmin(request: Request): boolean {
  const key = new URL(request.url).searchParams.get("key");
  return !!key && key === process.env.ADMIN_KEY;
}

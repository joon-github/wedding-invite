import { invitation } from "@/lib/invitation";

export function GET() {
  return Response.json(invitation);
}

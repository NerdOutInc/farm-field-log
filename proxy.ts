import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Next.js 16 "proxy" (formerly "middleware"): runs before each matched request.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Run on every route except static files and images.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};

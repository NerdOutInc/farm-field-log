import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// The link in Supabase's confirmation email lands here. Depending on the email
// template it carries either a `code` (default) or a `token_hash` + `type`.
// Either way we exchange it for a session cookie and send the user to /logs.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}/logs`);
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(`${origin}/logs`);
  }

  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent("That confirmation link is invalid or has expired. Try signing in, or sign up again.")}`,
  );
}

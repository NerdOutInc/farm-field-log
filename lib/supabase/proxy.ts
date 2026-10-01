import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "./config";

// Routes that require a signed-in user.
const PROTECTED_PREFIXES = ["/logs"];
// Routes a signed-in user doesn't need to see.
const AUTH_ROUTES = ["/login"];

// Runs before every matched request (see /proxy.ts). It:
//   1. refreshes the Supabase auth session and writes updated cookies, and
//   2. redirects between /login and /logs based on whether a user is signed in.
// Row Level Security in the database is still the real security boundary —
// this only keeps people from landing on pages they can't use.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const config = getSupabaseConfig();
  // Without configuration the root layout shows setup instructions instead.
  if (!config) return response;

  const supabase = createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  // Don't run code between createServerClient and getClaims() — getClaims()
  // validates the token and triggers the cookie refresh above.
  const { data } = await supabase.auth.getClaims();
  const isSignedIn = Boolean(data?.claims);

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (!isSignedIn && isProtected) {
    return redirectWithCookies(request, response, "/login");
  }
  if (isSignedIn && isAuthRoute) {
    return redirectWithCookies(request, response, "/logs");
  }

  return response;
}

// A redirect must carry over any refreshed auth cookies, or the user would be
// signed out on the next request.
function redirectWithCookies(request: NextRequest, response: NextResponse, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  const redirect = NextResponse.redirect(url);
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}

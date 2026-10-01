import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getMissingSupabaseEnvVars, getSupabaseConfig } from "./config";

// Supabase client for Server Components, Server Actions, and Route Handlers.
// It reads and writes the auth session from the request cookies.
// Create a new client per request — never share one between users.
export async function createClient() {
  // Reading cookies first also tells Next.js this page is per-request (dynamic),
  // so it isn't pre-rendered at build time — even before Supabase is configured.
  const cookieStore = await cookies();

  const config = getSupabaseConfig();
  if (!config) {
    throw new Error(
      `Supabase is not configured. Missing: ${getMissingSupabaseEnvVars().join(", ")}. ` +
        "Copy .env.example to .env.local and fill in the values from your Supabase project.",
    );
  }

  return createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Components can't set cookies. That's fine: proxy.ts
          // refreshes the session cookie on every request.
        }
      },
    },
  });
}

"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// `email` is echoed back so the form can keep it filled in after an error.
export type AuthState = { error?: string; message?: string; email?: string };

function readCredentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const { email, password } = readCredentials(formData);
  if (!email || !password) return { error: "Enter your email and password.", email };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.code === "email_not_confirmed") {
      return { error: "Please confirm your email address first — check your inbox for the link.", email };
    }
    return { error: error.message, email };
  }

  redirect("/logs");
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const { email, password } = readCredentials(formData);
  if (!email || !password) return { error: "Enter your email and a password.", email };
  if (password.length < 6) return { error: "Password must be at least 6 characters.", email };

  // The confirmation email links back to this app, wherever it's running
  // (localhost during development, your Vercel URL in production).
  const origin = (await headers()).get("origin") ?? "";

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/confirm` },
  });

  if (error) return { error: error.message, email };

  // If "Confirm email" is turned off in Supabase, the user is signed in right away.
  if (data.session) redirect("/logs");

  return { message: "Check your email for a confirmation link, then sign in.", email };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

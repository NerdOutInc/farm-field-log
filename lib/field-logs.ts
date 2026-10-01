import "server-only";
import type { PostgrestError } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Category, FieldLog } from "@/lib/categories";

// All reads from the field_logs table live here. Writes live in
// app/logs/actions.ts. Notice there's no `.eq("user_id", ...)` — Row Level
// Security in the database already limits every query to the signed-in user.
//
// These return { logs, error } instead of throwing, because Next.js hides
// thrown error messages in production and we want setup problems to be obvious.

type ListResult = { logs: FieldLog[]; error: null } | { logs: null; error: string };

export async function listFieldLogs(category?: Category): Promise<ListResult> {
  const supabase = await createClient();

  let query = supabase
    .from("field_logs")
    .select("*")
    .order("occurred_at", { ascending: false });

  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) return { logs: null, error: describeDatabaseError(error) };
  return { logs: data as FieldLog[], error: null };
}

export async function listFieldLogsWithLocation(): Promise<ListResult> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("field_logs")
    .select("*")
    .not("latitude", "is", null)
    .not("longitude", "is", null)
    .order("occurred_at", { ascending: false });

  if (error) return { logs: null, error: describeDatabaseError(error) };
  return { logs: data as FieldLog[], error: null };
}

// The most recent location the user logged — a sensible place to start the map.
export async function getLatestLocation() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("field_logs")
    .select("latitude, longitude")
    .not("latitude", "is", null)
    .not("longitude", "is", null)
    .order("occurred_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data as { latitude: number; longitude: number } | null;
}

export async function getFieldLog(id: string): Promise<FieldLog | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("field_logs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  // An invalid UUID is just "not found" from the user's point of view.
  if (error?.code === "22P02") return null;
  if (error) throw new Error(describeDatabaseError(error));
  return data as FieldLog | null;
}

// Turns common setup mistakes into messages that say what to do next.
export function describeDatabaseError(error: PostgrestError): string {
  if (error.code === "PGRST205" || error.code === "42P01") {
    return (
      'The "field_logs" table was not found. Run the SQL in ' +
      "supabase/migrations/ against your Supabase project (see the README)."
    );
  }
  if (error.code === "42501") {
    return "Permission denied by the database. Make sure you're signed in and the RLS policies from the migration are in place.";
  }
  return `Database error: ${error.message}`;
}

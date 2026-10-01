"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CATEGORIES, isCategory, type Category } from "@/lib/categories";
import { describeDatabaseError } from "@/lib/field-logs";
import { createClient } from "@/lib/supabase/server";

// All writes to the field_logs table live here. Row Level Security makes sure
// a user can only insert, update, or delete their own rows. user_id is filled
// in by the database (default auth.uid()), so we never send it from the app.

export type LogFormState = { error?: string };

type FieldLogInput = {
  title: string;
  notes: string;
  category: Category;
  occurred_at: string;
  latitude: number | null;
  longitude: number | null;
};

function parseForm(formData: FormData): { input: FieldLogInput } | { error: string } {
  const title = String(formData.get("title") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const category = formData.get("category");
  const occurredAt = String(formData.get("occurred_at") ?? "");
  const latitudeRaw = String(formData.get("latitude") ?? "").trim();
  const longitudeRaw = String(formData.get("longitude") ?? "").trim();

  if (!title) return { error: "Give the entry a title, like “Scouted Field 12”." };
  if (title.length > 200) return { error: "Title must be 200 characters or fewer." };
  if (!isCategory(category)) {
    return { error: `Pick a category: ${CATEGORIES.join(", ")}.` };
  }
  if (!occurredAt || Number.isNaN(Date.parse(occurredAt))) {
    return { error: "Choose when this happened." };
  }

  let latitude: number | null = null;
  let longitude: number | null = null;
  if (latitudeRaw || longitudeRaw) {
    latitude = Number(latitudeRaw);
    longitude = Number(longitudeRaw);
    const valid =
      latitudeRaw !== "" &&
      longitudeRaw !== "" &&
      Math.abs(latitude) <= 90 &&
      Math.abs(longitude) <= 180;
    if (!valid) {
      return {
        error: "Location needs both a latitude (-90 to 90) and a longitude (-180 to 180), or leave both blank.",
      };
    }
  }

  return {
    input: {
      title,
      notes,
      category,
      occurred_at: new Date(occurredAt).toISOString(),
      latitude,
      longitude,
    },
  };
}

export async function createFieldLog(_prev: LogFormState, formData: FormData): Promise<LogFormState> {
  const parsed = parseForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase.from("field_logs").insert(parsed.input);
  if (error) return { error: describeDatabaseError(error) };

  revalidatePath("/logs", "layout");
  redirect("/logs");
}

export async function updateFieldLog(
  id: string,
  _prev: LogFormState,
  formData: FormData,
): Promise<LogFormState> {
  const parsed = parseForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("field_logs")
    .update(parsed.input)
    .eq("id", id)
    .select("id");

  if (error) return { error: describeDatabaseError(error) };
  // RLS filters out rows you don't own, so "0 rows updated" means not yours / not found.
  if (data.length === 0) return { error: "That entry no longer exists." };

  revalidatePath("/logs", "layout");
  redirect("/logs");
}

export async function deleteFieldLog(id: string): Promise<LogFormState> {
  const supabase = await createClient();
  const { error } = await supabase.from("field_logs").delete().eq("id", id);
  if (error) return { error: describeDatabaseError(error) };

  revalidatePath("/logs", "layout");
  return {};
}

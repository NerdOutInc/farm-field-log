// Shared types and constants, safe to import from server or client code.

export const CATEGORIES = [
  "scouting",
  "planting",
  "spraying",
  "harvest",
  "maintenance",
  "other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  scouting: "Scouting",
  planting: "Planting",
  spraying: "Spraying",
  harvest: "Harvest",
  maintenance: "Maintenance",
  other: "Other",
};

export function isCategory(value: unknown): value is Category {
  return typeof value === "string" && (CATEGORIES as readonly string[]).includes(value);
}

// Matches a row in the field_logs table (see supabase/migrations).
export type FieldLog = {
  id: string;
  user_id: string;
  title: string;
  notes: string;
  category: Category;
  occurred_at: string;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
};

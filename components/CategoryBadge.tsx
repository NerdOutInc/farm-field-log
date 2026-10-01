import { CATEGORY_LABELS, type Category } from "@/lib/categories";

export const CATEGORY_STYLES: Record<Category, { badge: string; dot: string }> = {
  scouting: { badge: "bg-sky-50 text-sky-800 ring-sky-200", dot: "bg-sky-500" },
  planting: { badge: "bg-field-50 text-field-800 ring-field-100", dot: "bg-field-600" },
  spraying: { badge: "bg-teal-50 text-teal-800 ring-teal-200", dot: "bg-teal-500" },
  harvest: { badge: "bg-wheat-100 text-amber-900 ring-amber-200", dot: "bg-wheat-500" },
  maintenance: { badge: "bg-stone-100 text-stone-700 ring-stone-200", dot: "bg-stone-500" },
  other: { badge: "bg-violet-50 text-violet-800 ring-violet-200", dot: "bg-violet-400" },
};

export function CategoryBadge({ category }: { category: Category }) {
  const style = CATEGORY_STYLES[category];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${style.badge}`}>
      <span className={`size-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {CATEGORY_LABELS[category]}
    </span>
  );
}

import Link from "next/link";
import { CATEGORIES, CATEGORY_LABELS, type Category } from "@/lib/categories";

// Filtering is just a link with ?category=… — the page re-queries Supabase.
export function CategoryFilter({ active }: { active?: Category }) {
  const options: { label: string; href: string; isActive: boolean }[] = [
    { label: "All", href: "/logs", isActive: !active },
    ...CATEGORIES.map((category) => ({
      label: CATEGORY_LABELS[category],
      href: `/logs?category=${category}`,
      isActive: active === category,
    })),
  ];

  return (
    <nav aria-label="Filter by category" className="-mx-4 overflow-x-auto px-4">
      <ul className="flex gap-2 pb-1">
        {options.map((option) => (
          <li key={option.href}>
            <Link
              href={option.href}
              aria-current={option.isActive ? "page" : undefined}
              className={
                "inline-block whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition " +
                (option.isActive
                  ? "border-field-700 bg-field-700 text-white"
                  : "border-line bg-surface text-muted hover:border-field-600/40 hover:text-ink")
              }
            >
              {option.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

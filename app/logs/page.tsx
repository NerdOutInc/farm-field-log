import Link from "next/link";
import { Alert } from "@/components/Alert";
import { CategoryFilter } from "@/components/CategoryFilter";
import { LogCard } from "@/components/LogCard";
import { primaryButtonClass, secondaryButtonClass } from "@/components/styles";
import { CATEGORY_LABELS, isCategory } from "@/lib/categories";
import { listFieldLogs } from "@/lib/field-logs";

export default async function LogsPage({ searchParams }: PageProps<"/logs">) {
  const { category: categoryParam } = await searchParams;
  const category = isCategory(categoryParam) ? categoryParam : undefined;

  const { logs, error } = await listFieldLogs(category);

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Field Log</h1>
          <p className="mt-1 text-muted">What happened out there, newest first.</p>
        </div>
        <Link href="/logs/new" className={`${primaryButtonClass} shrink-0 whitespace-nowrap`}>
          <span aria-hidden="true" className="text-base leading-none">+</span>
          New entry
        </Link>
      </div>

      <div className="mt-6">
        <CategoryFilter active={category} />
      </div>

      <div className="mt-6">
        {!logs ? (
          <Alert tone="error">
            <strong className="font-semibold">Couldn&apos;t load your field logs.</strong> {error}
          </Alert>
        ) : logs.length === 0 ? (
          <EmptyState filteredLabel={category ? CATEGORY_LABELS[category] : undefined} />
        ) : (
          <div className="relative space-y-4">
            {/* The vertical "timeline" line behind the cards */}
            <div className="absolute top-2 bottom-2 left-3 w-px bg-line" aria-hidden="true" />
            {logs.map((log) => (
              <LogCard key={log.id} log={log} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ filteredLabel }: { filteredLabel?: string }) {
  return (
    <div className="crop-rows rounded-2xl border border-dashed border-line bg-surface px-6 py-14 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-full bg-field-50 text-field-700">
        <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d="M12 20v-9" />
          <path d="M12 13c0-3 2.2-5 5.5-5 0 3.2-2.2 5-5.5 5Z" />
          <path d="M12 15c0-2.7-2-4.5-5-4.5 0 2.9 2 4.5 5 4.5Z" />
        </svg>
      </div>
      {filteredLabel ? (
        <>
          <h2 className="mt-4 text-lg font-semibold">No {filteredLabel.toLowerCase()} entries yet</h2>
          <p className="mx-auto mt-1 max-w-sm text-muted">Try another category, or log something new.</p>
          <div className="mt-6 flex justify-center gap-2">
            <Link href="/logs" className={secondaryButtonClass}>Show all</Link>
            <Link href="/logs/new" className={primaryButtonClass}>New entry</Link>
          </div>
        </>
      ) : (
        <>
          <h2 className="mt-4 text-lg font-semibold">Your field log is empty</h2>
          <p className="mx-auto mt-1 max-w-sm text-muted">
            Record what you did today — “Scouted Field 12”, “Sprayed the north 80”, or
            “Changed oil on the tractor”.
          </p>
          <Link href="/logs/new" className={`${primaryButtonClass} mt-6`}>Add your first entry</Link>
        </>
      )}
    </div>
  );
}

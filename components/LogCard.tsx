import Link from "next/link";
import { CategoryBadge, CATEGORY_STYLES } from "@/components/CategoryBadge";
import { DeleteLogButton } from "@/components/DeleteLogButton";
import { LocalDateTime } from "@/components/LocalDateTime";
import type { FieldLog } from "@/lib/categories";

export function LogCard({ log }: { log: FieldLog }) {
  const hasLocation = log.latitude !== null && log.longitude !== null;

  return (
    <article className="relative pl-8">
      {/* Timeline dot, colored by category */}
      <span
        className={`absolute top-6 left-[7px] size-3 rounded-full ring-4 ring-canvas ${CATEGORY_STYLES[log.category].dot}`}
        aria-hidden="true"
      />
      <div className="rounded-xl border border-line bg-surface p-4 shadow-xs transition hover:shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <CategoryBadge category={log.category} />
          <LocalDateTime iso={log.occurred_at} className="text-sm text-muted" />
        </div>

        <h2 className="mt-2.5 text-lg font-semibold leading-snug tracking-tight text-ink">{log.title}</h2>

        {log.notes && <p className="mt-1.5 whitespace-pre-line text-[15px] leading-relaxed text-ink/80">{log.notes}</p>}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line/70 pt-3">
          <p className="text-xs text-muted">
            {hasLocation ? (
              <span className="inline-flex items-center gap-1 font-mono">
                <PinIcon />
                {log.latitude!.toFixed(5)}, {log.longitude!.toFixed(5)}
              </span>
            ) : (
              "No location"
            )}
          </p>
          <div className="flex items-center gap-1">
            <Link
              href={`/logs/${log.id}/edit`}
              className="rounded-md px-2.5 py-1 text-sm font-medium text-field-700 hover:bg-field-50"
            >
              Edit
            </Link>
            <DeleteLogButton id={log.id} title={log.title} />
          </div>
        </div>
      </div>
    </article>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-3.5" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18s6-5.3 6-10a6 6 0 1 0-12 0c0 4.7 6 10 6 10Zm0-7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" clipRule="evenodd" />
    </svg>
  );
}

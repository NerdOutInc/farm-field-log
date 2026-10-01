import Link from "next/link";

// A sprout over three crop rows.
export function Logo({ href, compactOnMobile = false }: { href?: string; compactOnMobile?: boolean }) {
  const content = (
    <span className="inline-flex items-center gap-2.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-field-700 text-white shadow-sm">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d="M12 14V7" />
          <path d="M12 9c0-2.5 1.8-4 4.5-4 0 2.6-1.8 4-4.5 4Z" />
          <path d="M12 11c0-2.2-1.6-3.5-4-3.5 0 2.3 1.6 3.5 4 3.5Z" />
          <path d="M4 17.5h16M6 20.5h12" />
        </svg>
      </span>
      <span className={`whitespace-nowrap text-lg font-semibold tracking-tight text-ink ${compactOnMobile ? "sr-only sm:not-sr-only" : ""}`}>
        Farm Field Log
      </span>
    </span>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

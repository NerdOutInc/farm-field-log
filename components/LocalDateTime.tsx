"use client";

import { useIsClient } from "@/lib/use-is-client";

const formatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

// Shows a timestamp in the viewer's local time zone.
export function LocalDateTime({ iso, className }: { iso: string; className?: string }) {
  const isClient = useIsClient();
  return (
    <time dateTime={iso} className={className}>
      {isClient ? formatter.format(new Date(iso)) : " "}
    </time>
  );
}

"use client";

import { Alert } from "@/components/Alert";
import { secondaryButtonClass } from "@/components/styles";

// Catches unexpected errors on any /logs page. (Expected problems, like a
// missing table, are shown inline by the page itself.)
export default function LogsError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
      <Alert tone="error">
        {error.message || "An unexpected error occurred."}
        {error.digest && <span className="mt-1 block text-xs opacity-70">Reference: {error.digest}</span>}
      </Alert>
      <button type="button" onClick={retry} className={secondaryButtonClass}>
        Try again
      </button>
    </div>
  );
}

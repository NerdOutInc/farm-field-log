// Shown automatically by Next.js while a /logs page is loading.
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading field logs">
      <div className="h-9 w-40 animate-pulse rounded-lg bg-line/70" />
      <div className="mt-2 h-5 w-64 animate-pulse rounded bg-line/50" />
      <div className="mt-8 space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="ml-8 rounded-xl border border-line bg-surface p-5">
            <div className="h-5 w-24 animate-pulse rounded-full bg-line/70" />
            <div className="mt-3 h-6 w-2/3 animate-pulse rounded bg-line/70" />
            <div className="mt-2 h-4 w-full animate-pulse rounded bg-line/50" />
          </div>
        ))}
      </div>
    </div>
  );
}

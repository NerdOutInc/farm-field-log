import type { Metadata } from "next";
import Link from "next/link";
import { Alert } from "@/components/Alert";
import { FieldLogMap } from "@/components/map/FieldLogMap";
import { primaryButtonClass } from "@/components/styles";
import { listFieldLogsWithLocation } from "@/lib/field-logs";
import { isMapEnabled } from "@/lib/mapbox";

export const metadata: Metadata = { title: "Map · Farm Field Log" };

export default async function MapPage() {
  if (!isMapEnabled) return <MapDisabled />;

  const { logs, error } = await listFieldLogsWithLocation();

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Map</h1>
      <p className="mt-1 text-muted">Every entry that has a location. Click a marker for details.</p>

      <div className="mt-6">
        {!logs ? (
          <Alert tone="error">
            <strong className="font-semibold">Couldn&apos;t load your field logs.</strong> {error}
          </Alert>
        ) : (
          <>
            {logs.length === 0 && (
              <div className="mb-4">
                <Alert tone="info">
                  No entries have a location yet. Use <strong>Use Current Location</strong> when adding an entry
                  and it will show up here.
                </Alert>
              </div>
            )}
            <FieldLogMap
              logs={logs.filter((log): log is typeof log & { latitude: number; longitude: number } =>
                log.latitude !== null && log.longitude !== null,
              )}
            />
          </>
        )}
      </div>
    </div>
  );
}

function MapDisabled() {
  return (
    <div className="crop-rows rounded-2xl border border-dashed border-line bg-surface px-6 py-14 text-center">
      <h1 className="text-xl font-semibold">Map view is optional</h1>
      <p className="mx-auto mt-2 max-w-md text-muted">
        Add a <code className="rounded bg-wheat-100 px-1.5 py-0.5 font-mono text-sm">NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code>{" "}
        environment variable and rebuild to see your entries on a map. Everything else works without it.
      </p>
      <Link href="/logs" className={`${primaryButtonClass} mt-6`}>Back to your field log</Link>
    </div>
  );
}

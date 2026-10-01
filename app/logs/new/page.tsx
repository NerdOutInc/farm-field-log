import type { Metadata } from "next";
import { LogForm } from "@/components/LogForm";
import { getLatestLocation } from "@/lib/field-logs";
import { isMapEnabled } from "@/lib/mapbox";
import { createFieldLog } from "../actions";

export const metadata: Metadata = { title: "New entry · Farm Field Log" };

export default async function NewLogPage() {
  const mapCenter = isMapEnabled ? await getLatestLocation() : null;

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">New entry</h1>
      <p className="mt-1 text-muted">Record what happened in the field.</p>
      <div className="mt-6">
        <LogForm action={createFieldLog} submitLabel="Save entry" mapCenter={mapCenter} />
      </div>
    </div>
  );
}

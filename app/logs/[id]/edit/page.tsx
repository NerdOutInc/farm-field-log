import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LogForm } from "@/components/LogForm";
import { getFieldLog } from "@/lib/field-logs";
import { updateFieldLog } from "../../actions";

export const metadata: Metadata = { title: "Edit entry · Farm Field Log" };

export default async function EditLogPage({ params }: PageProps<"/logs/[id]/edit">) {
  const { id } = await params;
  // RLS means another user's log comes back as null, just like a missing one.
  const log = await getFieldLog(id);
  if (!log) notFound();

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Edit entry</h1>
      <p className="mt-1 text-muted">Update the details of this field log.</p>
      <div className="mt-6">
        <LogForm action={updateFieldLog.bind(null, log.id)} log={log} submitLabel="Save changes" />
      </div>
    </div>
  );
}

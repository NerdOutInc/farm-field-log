"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { LogFormState } from "@/app/logs/actions";
import { Alert } from "@/components/Alert";
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from "@/components/styles";
import { CATEGORIES, CATEGORY_LABELS, type FieldLog } from "@/lib/categories";
import { useIsClient } from "@/lib/use-is-client";

type Props = {
  // A Server Action: createFieldLog, or updateFieldLog bound to an id.
  action: (state: LogFormState, formData: FormData) => Promise<LogFormState>;
  log?: FieldLog;
  submitLabel: string;
};

export function LogForm({ action, log, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const isClient = useIsClient();

  // Fields are controlled so values survive a failed submit.
  const [title, setTitle] = useState(log?.title ?? "");
  const [category, setCategory] = useState<string>(log?.category ?? "scouting");
  const [notes, setNotes] = useState(log?.notes ?? "");
  // null = "not edited yet": show the log's time (or now) in the viewer's time zone.
  const [occurredAtLocal, setOccurredAtLocal] = useState<string | null>(null);
  const [openedAt] = useState(() => new Date());
  const [latitude, setLatitude] = useState(log?.latitude?.toString() ?? "");
  const [longitude, setLongitude] = useState(log?.longitude?.toString() ?? "");
  const [locationStatus, setLocationStatus] = useState<{ tone: "info" | "error"; text: string } | null>(null);
  const [locating, setLocating] = useState(false);

  const dateValue = occurredAtLocal ?? (isClient ? toDateTimeLocal(log ? new Date(log.occurred_at) : openedAt) : "");
  // <input type="datetime-local"> has no time zone, so we send the server a full ISO timestamp.
  const parsedDate = new Date(dateValue);
  const occurredAtIso = Number.isNaN(parsedDate.getTime()) ? "" : parsedDate.toISOString();

  function fillCurrentLocation() {
    if (!("geolocation" in navigator)) {
      setLocationStatus({ tone: "error", text: "Your browser doesn't support location. You can still save without one." });
      return;
    }

    setLocating(true);
    setLocationStatus(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setLocationStatus({ tone: "info", text: `Location added (accurate to about ${Math.round(position.coords.accuracy)} m).` });
        setLocating(false);
      },
      (error) => {
        const text =
          error.code === error.PERMISSION_DENIED
            ? "Location access was denied. That's fine — the entry will save without a location."
            : "Couldn't get your location right now. You can try again or save without one.";
        setLocationStatus({ tone: "error", text });
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }

  function clearLocation() {
    setLatitude("");
    setLongitude("");
    setLocationStatus(null);
  }

  return (
    <form action={formAction} className="space-y-6 rounded-2xl border border-line bg-surface p-5 shadow-xs sm:p-7">
      {state.error && <Alert tone="error">{state.error}</Alert>}

      <div>
        <label htmlFor="title" className={labelClass}>Title</label>
        <input
          id="title"
          name="title"
          required
          maxLength={200}
          placeholder="Scouted Field 12"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className={labelClass}>Category</label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="occurred_at_local" className={labelClass}>Date &amp; time</label>
          <input
            id="occurred_at_local"
            type="datetime-local"
            required
            value={dateValue}
            onChange={(e) => setOccurredAtLocal(e.target.value)}
            className={inputClass}
          />
          <input type="hidden" name="occurred_at" value={occurredAtIso} />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className={labelClass}>
          Notes <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={5}
          placeholder="Found waterhemp in the northwest corner, roughly 2 acres…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={inputClass}
        />
      </div>

      <fieldset className="rounded-xl border border-line bg-canvas/60 p-4">
        <legend className="px-1 text-sm font-medium text-ink">
          Location <span className="font-normal text-muted">(optional)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={fillCurrentLocation} disabled={locating} className={secondaryButtonClass}>
            {locating ? "Locating…" : "Use Current Location"}
          </button>
          {(latitude || longitude) && (
            <button type="button" onClick={clearLocation} className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-ink">
              Clear
            </button>
          )}
        </div>
        {locationStatus && (
          <p className={`mt-3 text-sm ${locationStatus.tone === "error" ? "text-red-700" : "text-field-700"}`}>
            {locationStatus.text}
          </p>
        )}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="latitude" className="mb-1 block text-xs font-medium text-muted">Latitude</label>
            <input
              id="latitude"
              name="latitude"
              inputMode="decimal"
              placeholder="41.878100"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className={`${inputClass} font-mono text-sm`}
            />
          </div>
          <div>
            <label htmlFor="longitude" className="mb-1 block text-xs font-medium text-muted">Longitude</label>
            <input
              id="longitude"
              name="longitude"
              inputMode="decimal"
              placeholder="-93.097700"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className={`${inputClass} font-mono text-sm`}
            />
          </div>
        </div>
      </fieldset>

      <div className="flex flex-col-reverse gap-2 border-t border-line pt-5 sm:flex-row sm:justify-end">
        <Link href="/logs" className={secondaryButtonClass}>Cancel</Link>
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

// Formats a Date as "YYYY-MM-DDTHH:mm" in the browser's local time zone.
function toDateTimeLocal(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import { CATEGORY_LABELS, type FieldLog } from "@/lib/categories";
import { mapboxAccessToken } from "@/lib/mapbox";

// Hex colors for markers (Tailwind classes can't style Mapbox markers).
const MARKER_COLORS: Record<FieldLog["category"], string> = {
  scouting: "#0ea5e9",
  planting: "#2f6b3c",
  spraying: "#14b8a6",
  harvest: "#c39a3b",
  maintenance: "#78716c",
  other: "#a78bfa",
};

type MappedLog = FieldLog & { latitude: number; longitude: number };

export function FieldLogMap({ logs }: { logs: MappedLog[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let map: import("mapbox-gl").Map | undefined;
    let cancelled = false;

    // mapbox-gl touches `window`, so load it only in the browser.
    import("mapbox-gl").then(({ default: mapboxgl }) => {
      if (cancelled || !containerRef.current) return;

      mapboxgl.accessToken = mapboxAccessToken;
      map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/outdoors-v12",
        center: [-95.7, 39.8], // Continental US, used when there are no markers
        zoom: 3,
      });
      map.addControl(new mapboxgl.NavigationControl(), "top-right");
      map.on("error", (event) => {
        const status = (event.error as { status?: number } | undefined)?.status;
        if (status === 401 || status === 403) {
          setError("Mapbox rejected the access token. Check NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN.");
        }
      });

      const bounds = new mapboxgl.LngLatBounds();
      for (const log of logs) {
        const lngLat: [number, number] = [log.longitude, log.latitude];
        new mapboxgl.Marker({ color: MARKER_COLORS[log.category] })
          .setLngLat(lngLat)
          .setPopup(new mapboxgl.Popup({ offset: 24, maxWidth: "260px" }).setDOMContent(popupContent(log)))
          .addTo(map);
        bounds.extend(lngLat);
      }

      if (logs.length === 1) {
        map.jumpTo({ center: bounds.getCenter(), zoom: 13 });
      } else if (logs.length > 1) {
        map.fitBounds(bounds, { padding: 60, maxZoom: 15, duration: 0 });
      }
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [logs]);

  return (
    <div>
      {error && <p className="mb-3 text-sm text-red-700">{error}</p>}
      <div ref={containerRef} className="h-[60vh] min-h-80 w-full overflow-hidden rounded-2xl border border-line bg-field-50" />
    </div>
  );
}

// Built with DOM nodes (not an HTML string) so user-entered text can't inject markup.
function popupContent(log: FieldLog) {
  const root = document.createElement("div");
  root.className = "space-y-1 font-sans";

  const category = document.createElement("p");
  category.className = "text-xs font-semibold uppercase tracking-wide";
  category.style.color = MARKER_COLORS[log.category];
  category.textContent = CATEGORY_LABELS[log.category];

  const title = document.createElement("p");
  title.className = "text-sm font-semibold text-ink";
  title.textContent = log.title;

  const date = document.createElement("p");
  date.className = "text-xs text-muted";
  date.textContent = new Date(log.occurred_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

  root.append(category, title, date);

  if (log.notes) {
    const notes = document.createElement("p");
    notes.className = "pt-1 text-xs text-ink/80";
    notes.textContent = log.notes.length > 140 ? `${log.notes.slice(0, 140)}…` : log.notes;
    root.append(notes);
  }

  const link = document.createElement("a");
  link.href = `/logs/${log.id}/edit`;
  link.className = "inline-block pt-1 text-xs font-medium text-field-700 underline";
  link.textContent = "Edit entry";
  root.append(link);

  return root;
}

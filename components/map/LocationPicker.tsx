"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import { mapboxAccessToken } from "@/lib/mapbox";

type LngLat = { latitude: number; longitude: number };

type Props = {
  // The current pin, or null when the entry has no location.
  value: LngLat | null;
  onChange: (value: LngLat) => void;
  // Where to center the map when there's no pin yet.
  initialCenter?: LngLat | null;
};

// A small satellite map for choosing a log's location: click to drop a pin,
// drag the pin to adjust. Only rendered when a Mapbox token is configured.
export function LocationPicker({ value, onChange, initialCenter }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("mapbox-gl").Map | null>(null);
  const markerRef = useRef<import("mapbox-gl").Marker | null>(null);
  const mapboxRef = useRef<typeof import("mapbox-gl").default | null>(null);
  const onChangeRef = useRef(onChange);
  // Set when the pin moved because of a click/drag on the map, so we don't
  // also pan the map to it.
  const movedOnMapRef = useRef(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Create the map once.
  useEffect(() => {
    let cancelled = false;
    const start = value ?? initialCenter;

    import("mapbox-gl").then(({ default: mapboxgl }) => {
      if (cancelled || !containerRef.current) return;

      mapboxgl.accessToken = mapboxAccessToken;
      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        center: start ? [start.longitude, start.latitude] : [-95.7, 39.8],
        zoom: value ? 15 : start ? 13 : 3,
      });
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
      map.getCanvas().style.cursor = "crosshair";
      map.on("click", (event) => {
        movedOnMapRef.current = true;
        onChangeRef.current({ latitude: event.lngLat.lat, longitude: event.lngLat.lng });
      });

      mapboxRef.current = mapboxgl;
      mapRef.current = map;
      setIsReady(true);
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // Only the starting position matters here; later changes are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the pin in sync with the form's latitude/longitude.
  const latitude = value?.latitude ?? null;
  const longitude = value?.longitude ?? null;
  useEffect(() => {
    const map = mapRef.current;
    const mapboxgl = mapboxRef.current;
    if (!isReady || !map || !mapboxgl) return;

    if (latitude === null || longitude === null) {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }

    const lngLat: [number, number] = [longitude, latitude];
    if (!markerRef.current) {
      const marker = new mapboxgl.Marker({ color: "#c39a3b", draggable: true }).setLngLat(lngLat).addTo(map);
      marker.on("dragend", () => {
        const { lat, lng } = marker.getLngLat();
        movedOnMapRef.current = true;
        onChangeRef.current({ latitude: lat, longitude: lng });
      });
      markerRef.current = marker;
    } else {
      markerRef.current.setLngLat(lngLat);
    }

    // The location came from "Use Current Location" or typed coordinates: bring it into view.
    if (!movedOnMapRef.current) {
      map.flyTo({ center: lngLat, zoom: Math.max(map.getZoom(), 15) });
    }
    movedOnMapRef.current = false;
  }, [isReady, latitude, longitude]);

  return (
    <div>
      <div
        ref={containerRef}
        className="h-64 w-full overflow-hidden rounded-lg border border-line bg-field-50 sm:h-72"
        aria-label="Map for choosing the entry's location"
      />
      <p className="mt-1.5 text-xs text-muted">Click the map to drop a pin. Drag the pin to fine-tune it.</p>
    </div>
  );
}

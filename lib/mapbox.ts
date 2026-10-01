// ─── Optional Mapbox integration ────────────────────────────────────────────
// The map is an "extra" production feature: it turns on only when
// NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is set. Everything map-related lives in this
// file, components/map/, and app/logs/map/.
//
// NEXT_PUBLIC_* variables are baked in at build time, so after adding the token
// on Vercel you need to redeploy.

export const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "";

export const isMapEnabled = mapboxAccessToken.length > 0;

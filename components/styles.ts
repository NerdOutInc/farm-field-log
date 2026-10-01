// Shared Tailwind class strings for form controls and buttons.

export const labelClass = "mb-1.5 block text-sm font-medium text-ink";

export const inputClass =
  "block w-full rounded-lg border border-line bg-white px-3 py-2 text-ink shadow-xs " +
  "placeholder:text-muted/60 focus:border-field-600 focus:outline-none focus:ring-2 focus:ring-field-600/20";

export const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-field-700 px-4 py-2 text-sm font-semibold text-white " +
  "shadow-sm transition hover:bg-field-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-field-600/40 " +
  "disabled:cursor-not-allowed disabled:opacity-60";

export const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium text-ink " +
  "shadow-xs transition hover:bg-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-field-600/30 " +
  "disabled:cursor-not-allowed disabled:opacity-60";

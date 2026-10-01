const TONES = {
  error: "border-red-200 bg-red-50 text-red-800",
  success: "border-field-100 bg-field-50 text-field-800",
  info: "border-wheat-500/30 bg-wheat-100/60 text-ink",
};

export function Alert({ tone, children }: { tone: keyof typeof TONES; children: React.ReactNode }) {
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`rounded-lg border px-3 py-2.5 text-sm ${TONES[tone]}`}>
      {children}
    </div>
  );
}

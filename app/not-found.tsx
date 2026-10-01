import Link from "next/link";
import { primaryButtonClass } from "@/components/styles";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-wheat-500">Not found</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Nothing planted here</h1>
      <p className="mt-2 text-muted">That page or entry doesn&apos;t exist, or it isn&apos;t yours.</p>
      <Link href="/logs" className={`${primaryButtonClass} mt-6`}>Back to your field log</Link>
    </main>
  );
}

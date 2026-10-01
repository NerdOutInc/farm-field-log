import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import { Logo } from "@/components/Logo";
import { isMapEnabled } from "@/lib/mapbox";

export function SiteHeader({ email }: { email: string | null }) {
  return (
    <header className="crop-rows border-b border-line bg-surface/80">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 py-3">
        <Logo href="/logs" compactOnMobile />
        <div className="flex items-center gap-1 text-sm sm:gap-3">
          <nav className="flex items-center gap-1">
            <Link href="/logs" className="whitespace-nowrap rounded-md px-2.5 py-1.5 font-medium text-muted hover:bg-canvas hover:text-ink">
              Logs
            </Link>
            {isMapEnabled && (
              <Link href="/logs/map" className="whitespace-nowrap rounded-md px-2.5 py-1.5 font-medium text-muted hover:bg-canvas hover:text-ink">
                Map
              </Link>
            )}
          </nav>
          {email && <span className="hidden max-w-48 truncate text-muted md:inline" title={email}>{email}</span>}
          <form action={signOut}>
            <button type="submit" className="whitespace-nowrap rounded-md px-2.5 py-1.5 font-medium text-muted hover:bg-canvas hover:text-ink">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

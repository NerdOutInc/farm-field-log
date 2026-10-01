import { SiteHeader } from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";

export default async function LogsLayout({ children }: LayoutProps<"/logs">) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = typeof data?.claims.email === "string" ? data.claims.email : null;

  return (
    <>
      <SiteHeader email={email} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-10">{children}</main>
    </>
  );
}

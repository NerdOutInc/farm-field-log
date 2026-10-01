import { Logo } from "@/components/Logo";

export function SetupNotice({ missing }: { missing: string[] }) {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-16">
      <Logo />
      <div className="mt-8 rounded-2xl border border-wheat-500/40 bg-surface p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-wheat-500">Setup needed</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Connect your Supabase project</h1>
        <p className="mt-3 text-muted">
          The app is running, but it doesn&apos;t know which Supabase project to use yet. These
          environment variables are missing:
        </p>
        <ul className="mt-4 space-y-2">
          {missing.map((name) => (
            <li key={name}>
              <code className="rounded-md bg-wheat-100 px-2 py-1 font-mono text-sm">{name}</code>
            </li>
          ))}
        </ul>
        <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm text-muted">
          <li>
            <strong className="text-ink">Locally:</strong> copy <code className="font-mono">.env.example</code> to{" "}
            <code className="font-mono">.env.local</code>, fill in the values, and restart{" "}
            <code className="font-mono">npm run dev</code>.
          </li>
          <li>
            <strong className="text-ink">On Vercel:</strong> add them under Project → Settings →
            Environment Variables, then redeploy.
          </li>
          <li>
            Find both values in Supabase under <em>Project Settings → API Keys</em> (or the
            project&apos;s <em>Connect</em> dialog).
          </li>
        </ol>
      </div>
    </main>
  );
}

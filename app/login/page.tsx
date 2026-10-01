import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = { title: "Sign in · Farm Field Log" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { mode, error } = await searchParams;
  const isSignUp = mode === "signup";

  return (
    <main className="crop-rows flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="mt-8 rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-8">
          <h1 className="text-xl font-semibold tracking-tight">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {isSignUp
              ? "Start keeping a record of what happens in the field."
              : "Sign in to see your field log."}
          </p>
          {/* key resets the form state when switching between modes */}
          <AuthForm
            key={isSignUp ? "signup" : "signin"}
            mode={isSignUp ? "signup" : "signin"}
            initialError={typeof error === "string" ? error : undefined}
          />
        </div>
      </div>
    </main>
  );
}

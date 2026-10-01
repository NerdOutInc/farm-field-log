"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, signUp, type AuthState } from "@/app/auth/actions";
import { Alert } from "@/components/Alert";
import { inputClass, labelClass, primaryButtonClass } from "@/components/styles";

export function AuthForm({ mode, initialError }: { mode: "signin" | "signup"; initialError?: string }) {
  const isSignUp = mode === "signup";
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    isSignUp ? signUp : signIn,
    { error: initialError },
  );

  return (
    <form action={formAction} className="mt-6 space-y-4">
      {state.error && <Alert tone="error">{state.error}</Alert>}
      {state.message && <Alert tone="success">{state.message}</Alert>}

      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input id="email" name="email" type="email" autoComplete="email" defaultValue={state.email} required className={inputClass} />
      </div>
      <div>
        <label htmlFor="password" className={labelClass}>Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={isSignUp ? "new-password" : "current-password"}
          minLength={isSignUp ? 6 : undefined}
          required
          className={inputClass}
        />
      </div>

      <button type="submit" disabled={pending} className={`${primaryButtonClass} w-full`}>
        {pending ? "Please wait…" : isSignUp ? "Sign up" : "Sign in"}
      </button>

      <p className="text-center text-sm text-muted">
        {isSignUp ? "Already have an account? " : "New here? "}
        <Link
          href={isSignUp ? "/login" : "/login?mode=signup"}
          className="font-medium text-field-700 underline-offset-4 hover:underline"
        >
          {isSignUp ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}

"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { type FormEvent, Suspense, useState } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/workspaces";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await signIn("credentials", {
        username: username.trim(),
        password,
        redirect: false,
      });
      if (!result || result.error) {
        setError("Those credentials don't match a demo persona.");
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-[440px] space-y-10">
        <div className="flex justify-center">
          <Link href="/" aria-label="Back to home">
            {/* biome-ignore lint/performance/noImgElement: logo should render immediately on first paint */}
            <img
              src="/logo-landscape.svg"
              alt="Context Layer"
              width={320}
              height={72}
              className="h-auto w-[320px]"
            />
          </Link>
        </div>

        <div className="space-y-3 text-center">
          <h1 className="text-section-heading text-black">Sign in to the Playground</h1>
          <p className="text-body text-[#4e4e4e]">
            Demo environment — pick a persona to preview the product at a different state.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <label htmlFor="username" className="text-caption text-[#4e4e4e] block">
              Persona
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="empty, partial, or full"
              className="w-full text-body-standard text-black bg-white rounded-card px-4 py-3 shadow-[var(--shadow-inset-border)] placeholder:text-[#aaa] focus:outline-none focus:shadow-[var(--shadow-outline-ring)] transition-shadow"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-caption text-[#4e4e4e] block">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-body-standard text-black bg-white rounded-card px-4 py-3 shadow-[var(--shadow-inset-border)] focus:outline-none focus:shadow-[var(--shadow-outline-ring)] transition-shadow"
            />
          </div>

          {error ? (
            <p role="alert" className="text-small text-[#b91c1c] text-center">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting || !username || !password}
            className="w-full bg-black text-white text-button rounded-pill py-3 transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-micro text-[#777169] text-center leading-relaxed">
          Demo personas:
          <span className="mx-1 rounded-subtle bg-[var(--color-stone)] px-1.5 py-0.5 font-mono">
            empty
          </span>
          <span className="mx-1 rounded-subtle bg-[var(--color-stone)] px-1.5 py-0.5 font-mono">
            partial
          </span>
          <span className="mx-1 rounded-subtle bg-[var(--color-stone)] px-1.5 py-0.5 font-mono">
            full
          </span>
          <span className="mx-2 text-[#cfcfcf]">·</span>
          Passwords come from environment variables.
        </p>
      </div>
    </main>
  );
}

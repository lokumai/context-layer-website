"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Eye, EyeOff, KeyRound, Layers, Lock, User } from "lucide-react";
import { cn } from "@/lib/cn";
import { FadeIn } from "@/components/motion/fade-in";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { isValidPersona } from "@context-layer/mocks";

const PERSONAS = [
  {
    id: "full" as const,
    title: "Full",
    story: "Finished demo — every page populated.",
    accent: "from-[rgba(138,90,43,0.18)] to-transparent",
    stat: "graduated workspace",
  },
  {
    id: "partial" as const,
    title: "Partial",
    story: "Sources + Wiki done. Generate the rest.",
    accent: "from-[rgba(201,165,114,0.16)] to-transparent",
    stat: "wiki-ready · no library",
  },
  {
    id: "empty" as const,
    title: "Empty",
    story: "Zero state — walk the first-time wizard.",
    accent: "from-[rgba(180,180,180,0.12)] to-transparent",
    stat: "no workspace yet",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function handleSignIn(persona: string, pwd: string = "demo") {
    setBusy(persona);
    setError(null);
    const res = await signIn("credentials", {
      username: persona,
      password: pwd,
      redirect: false,
    });
    if (res?.ok) {
      router.push("/play/workspaces");
    } else {
      setBusy(null);
      setError("Invalid persona. Try full, partial, or empty.");
    }
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidPersona(username.trim().toLowerCase())) {
      setError("Username must be one of: full, partial, empty");
      return;
    }
    handleSignIn(username.trim().toLowerCase(), password || "demo");
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      {/* ─────── Left panel: editorial ─────── */}
      <aside className="relative hidden flex-1 flex-col border-r border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] px-14 py-12 lg:flex">
        <div className="absolute inset-0 mesh-warm opacity-70" aria-hidden />
        <div
          className="absolute inset-0 grid-pattern opacity-30"
          aria-hidden
        />
        <div
          className="absolute inset-0 mix-blend-multiply opacity-60"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
          aria-hidden
        />

        <div className="relative z-[1] flex h-full flex-col">
          <Link href="/" className="group flex items-center gap-2.5 self-start">
            <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[var(--color-ink)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
              <Layers size={16} strokeWidth={1.8} />
            </span>
            <span className="font-display text-[22px] tracking-display">Context Layer</span>
          </Link>

          <div className="mt-auto max-w-lg">
            <FadeIn>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[var(--color-ink-whisper)]">
                Persistent context · 2026
              </span>
              <h1 className="font-display mt-6 text-[56px] leading-[1.02] tracking-display text-[var(--color-ink)]">
                Enter a <span className="font-editorial">living</span> knowledge base.
              </h1>
              <p className="mt-6 text-[17px] leading-relaxed text-[var(--color-ink-muted)]">
                Three demo personas. One canonical fixture. Pick where in the journey you want to start — or type credentials by hand.
              </p>
            </FadeIn>

            <FadeIn delay={0.2} className="mt-12 space-y-3">
              {[
                { label: "Multi-repo ingestion", detail: "GitHub, Drive, Notion — or manual upload" },
                { label: "Versioned Wiki", detail: "every sync is a commit, every job an audit trail" },
                { label: "Grounded chat", detail: "citations that open the exact line range" },
              ].map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start gap-4 border-l border-[var(--color-border)] pl-5"
                >
                  <div>
                    <div className="text-[14px] font-medium text-[var(--color-ink)]">{f.label}</div>
                    <div className="text-[13px] text-[var(--color-ink-muted)]">{f.detail}</div>
                  </div>
                </motion.div>
              ))}
            </FadeIn>
          </div>

          <div className="relative z-[1] mt-16 flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--color-ink-whisper)]">
            <span className="h-2 w-2 rounded-full bg-emerald-500 pulse-dot" />
            Secure mock auth · session stored locally
          </div>
        </div>
      </aside>

      {/* ─────── Right panel: the form ─────── */}
      <main className="relative flex flex-1 items-center justify-center px-6 py-12 md:px-10">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-10 flex items-center gap-2 text-[13px] text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)] lg:hidden">
            <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[var(--color-ink)] text-white">
              <Layers size={14} strokeWidth={1.8} />
            </span>
            <span className="font-display text-[18px] tracking-display">Context Layer</span>
          </Link>

          <FadeIn>
            <div className="mb-10">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[var(--color-ink-whisper)]">
                Sign in · Playground
              </span>
              <h2 className="font-display mt-3 text-[40px] leading-[1.05] tracking-display text-[var(--color-ink)]">
                Welcome back.
              </h2>
              <p className="mt-3 text-[14.5px] text-[var(--color-ink-muted)]">
                Sign in with a persona — or jump in with one click below.
              </p>
            </div>
          </FadeIn>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <FadeIn delay={0.08}>
              <label className="block">
                <span className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
                  Persona / Username
                </span>
                <div className="relative">
                  <User size={15} strokeWidth={1.6} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-whisper)]" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="full · partial · empty"
                    autoFocus
                    autoComplete="username"
                    className="w-full rounded-full border-0 bg-white pl-11 pr-4 py-3 text-[15px] shadow-inset focus:outline-none focus:shadow-[rgba(138,90,43,0.15)_0_0_0_3px,rgba(0,0,0,0.075)_0_0_0_0.5px_inset,rgba(0,0,0,0.06)_0_0_0_1px] transition-shadow"
                  />
                </div>
              </label>
            </FadeIn>

            <FadeIn delay={0.12}>
              <label className="block">
                <span className="mb-2 block font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
                  Password
                </span>
                <div className="relative">
                  <Lock size={15} strokeWidth={1.6} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-whisper)]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="any password (demo mode)"
                    autoComplete="current-password"
                    className="w-full rounded-full border-0 bg-white pl-11 pr-12 py-3 text-[15px] shadow-inset focus:outline-none focus:shadow-[rgba(138,90,43,0.15)_0_0_0_3px,rgba(0,0,0,0.075)_0_0_0_0.5px_inset,rgba(0,0,0,0.06)_0_0_0_1px] transition-shadow"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-whisper)] hover:text-[var(--color-ink)]"
                  >
                    {showPassword ? <EyeOff size={15} strokeWidth={1.6} /> : <Eye size={15} strokeWidth={1.6} />}
                  </button>
                </div>
              </label>
            </FadeIn>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[12px] bg-[var(--color-danger-bg)] px-4 py-2.5 text-[13px] text-[var(--color-danger-fg)]"
              >
                {error}
              </motion.div>
            )}

            <FadeIn delay={0.18}>
              <MagneticButton
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] py-3.5 text-[14.5px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_12px_28px_rgba(0,0,0,0.18)] transition-colors hover:bg-[#2a2a2a] disabled:opacity-40"
                type="submit"
                disabled={busy !== null}
              >
                {busy ? "Signing in…" : "Sign in"}
                <ArrowRight size={15} strokeWidth={1.8} className="transition-transform duration-300 group-hover:translate-x-[3px]" />
              </MagneticButton>
            </FadeIn>
          </form>

          <div className="mt-12">
            <div className="mb-5 flex items-center gap-3 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-whisper)]">
              <span className="h-[1px] flex-1 bg-[var(--color-border)]" />
              <span className="flex items-center gap-1.5">
                <KeyRound size={11} strokeWidth={1.8} />
                Quick enter
              </span>
              <span className="h-[1px] flex-1 bg-[var(--color-border)]" />
            </div>

            <div className="space-y-2">
              {PERSONAS.map((p, i) => (
                <motion.button
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => handleSignIn(p.id)}
                  disabled={busy !== null}
                  className={cn(
                    "group relative flex w-full items-center justify-between overflow-hidden rounded-[16px] border border-[var(--color-border)] bg-white px-5 py-3.5 text-left transition-all hover:border-[var(--color-ink)]/30 hover:shadow-card disabled:opacity-40",
                  )}
                >
                  <div
                    aria-hidden
                    className={cn(
                      "absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                      p.accent,
                    )}
                  />
                  <div className="relative flex items-center gap-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-ink)] font-display-bold text-[12px] uppercase text-white">
                      {p.title[0]}
                    </span>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-[17px] leading-tight text-[var(--color-ink)]">{p.title}</span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-whisper)]">
                          {p.stat}
                        </span>
                      </div>
                      <span className="text-[12.5px] text-[var(--color-ink-muted)]">{p.story}</span>
                    </div>
                  </div>
                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.6}
                    className="relative text-[var(--color-ink-whisper)] transition-all duration-300 group-hover:-translate-y-[2px] group-hover:translate-x-[2px] group-hover:text-[var(--color-ink)]"
                  />
                </motion.button>
              ))}
            </div>
          </div>

          <p className="mt-10 text-center text-[12px] text-[var(--color-ink-whisper)]">
            By signing in you agree to our{" "}
            <a href="#" className="underline decoration-[var(--color-ink-whisper)] underline-offset-[5px] hover:text-[var(--color-ink)]">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="underline decoration-[var(--color-ink-whisper)] underline-offset-[5px] hover:text-[var(--color-ink)]">
              Privacy
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}

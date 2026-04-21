// apps/web/app/login/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PERSONAS = [
  { id: "full", title: "Full", subtitle: "Complete demo — every page populated." },
  { id: "partial", title: "Partial", subtitle: "Sources + Wiki done; generate the rest." },
  { id: "empty", title: "Empty", subtitle: "Zero state — walk the first-time wizard." },
] as const;

export default function LoginPage() {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function enter(persona: string) {
    setBusy(persona);
    const res = await signIn("credentials", {
      username: persona,
      password: "demo",
      redirect: false,
    });
    if (res?.ok) router.push("/play/workspaces");
    else setBusy(null);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      <h1 className="font-waldenburg text-[48px] tracking-[-0.96px] mb-4">Choose a Demo Persona</h1>
      <p className="inter-airy text-[18px] text-neutral-600 mb-12 text-center max-w-xl">
        Each persona starts the playground at a different point in the journey.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {PERSONAS.map((p) => (
          <button
            key={p.id}
            onClick={() => enter(p.id)}
            disabled={busy !== null}
            className="bg-white rounded-2xl p-8 shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px] hover:shadow-[rgba(0,0,0,0.4)_0px_0px_1px,rgba(0,0,0,0.04)_0px_4px_4px] transition-all text-left disabled:opacity-50 min-h-[220px] flex flex-col"
          >
            <h2 className="font-waldenburg text-[28px] mb-3 capitalize">{p.title}</h2>
            <p className="text-neutral-500 text-[15px] flex-1">{p.subtitle}</p>
            <span className="mt-6 font-waldenburg-bold uppercase tracking-[0.7px] text-[13px]">
              {busy === p.id ? "Signing in…" : "Enter →"}
            </span>
          </button>
        ))}
      </div>
    </main>
  );
}

"use client";

import { LogOut, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { setPersistKey, useStore } from "@/stores";

export function ProfileMenu() {
  const { data: session } = useSession();
  const personaId = session?.user?.personaId ?? null;
  const initial = (personaId ?? "?").charAt(0).toUpperCase();
  const reset = useStore((s) => s.reset);

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [open]);

  async function handleSignOut() {
    reset();
    setPersistKey(null);
    await signOut({ callbackUrl: "/" });
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="w-9 h-9 rounded-pill bg-black text-white inline-flex items-center justify-center text-body-medium hover:opacity-90 transition-opacity"
      >
        {initial}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 bg-white rounded-card shadow-[var(--shadow-card)] border border-[rgba(0,0,0,0.05)] overflow-hidden text-nav"
        >
          <div className="px-3 py-3 flex items-center gap-2 border-b border-[rgba(0,0,0,0.05)]">
            <span className="w-8 h-8 rounded-pill bg-[#f5f2ef] text-black inline-flex items-center justify-center">
              <User size={16} strokeWidth={1.5} />
            </span>
            <div>
              <p className="text-body-medium text-black leading-tight">
                {session?.user?.name ?? "Guest"}
              </p>
              <p className="text-caption text-[#777169] leading-tight">
                Persona: {personaId ?? "—"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full text-left px-3 py-2 text-black hover:bg-[#f9f9f9] inline-flex items-center gap-2"
          >
            <LogOut size={14} strokeWidth={1.5} />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}

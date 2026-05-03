"use client";

import { useSession } from "next-auth/react";
import { type ReactNode, useEffect, useRef } from "react";
import { isPersonaId } from "@/lib/personas";
import { setPersistKey, useStore } from "@/stores";
import type { HydrationPayload } from "@/stores/types";

// Fetches /api/mocks/bootstrap when a persona signs in, writes the payload
// into the store, and flips the isHydrated flag. Idempotent per persona —
// subsequent renders do nothing. On logout, resets the store.

export function HydrationProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const hydrate = useStore((s) => s.hydrate);
  const reset = useStore((s) => s.reset);
  const personaInStore = useStore((s) => s.personaId);
  const isHydrated = useStore((s) => s.isHydrated);
  const inFlight = useRef(false);

  useEffect(() => {
    if (status === "loading") return;

    const personaFromSession = session?.user?.personaId;

    if (!session || !personaFromSession || !isPersonaId(personaFromSession)) {
      if (personaInStore !== null || isHydrated) reset();
      setPersistKey(null);
      return;
    }

    if (personaInStore === personaFromSession && isHydrated) return;
    if (inFlight.current) return;

    inFlight.current = true;
    setPersistKey(personaFromSession);
    fetch("/api/mocks/bootstrap", { credentials: "same-origin" })
      .then(async (res) => {
        if (!res.ok) throw new Error(`bootstrap failed: ${res.status}`);
        const data = (await res.json()) as { personaId: string; payload: HydrationPayload };
        if (!isPersonaId(data.personaId)) throw new Error("invalid persona in response");
        hydrate(data.payload, data.personaId);
      })
      .catch((err) => {
        console.error("[HydrationProvider]", err);
      })
      .finally(() => {
        inFlight.current = false;
      });
  }, [session, status, personaInStore, isHydrated, hydrate, reset]);

  useEffect(() => {
    if (isHydrated) {
      document.body.dataset.hydrated = "true";
    } else {
      delete document.body.dataset.hydrated;
    }
  }, [isHydrated]);

  return <>{children}</>;
}

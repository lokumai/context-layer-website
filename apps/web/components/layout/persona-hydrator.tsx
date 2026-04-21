// apps/web/components/layout/persona-hydrator.tsx
"use client";

import { useEffect } from "react";
import { usePlaygroundStore } from "@/store/playground-store";
import { isValidPersona, type Persona } from "@context-layer/mocks";

export function PersonaHydrator({ persona }: { persona: Persona }) {
  const current = usePlaygroundStore((s) => s.persona);
  const hydrate = usePlaygroundStore((s) => s.hydrateFromPersona);

  useEffect(() => {
    if (!isValidPersona(persona)) return;
    if (current !== persona) hydrate(persona);
  }, [persona, current, hydrate]);

  return null;
}

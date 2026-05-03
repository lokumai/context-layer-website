"use client";

import { notFound, useParams } from "next/navigation";
import { useEffect } from "react";
import { useStore } from "@/stores";

export function WorkspaceScopeClient({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined);
  const workspaces = useStore((s) => s.workspaces);
  const setActive = useStore((s) => s.setActiveWorkspace);
  const isHydrated = useStore((s) => s.isHydrated);

  useEffect(() => {
    if (!id) return;
    if (!isHydrated) return;
    const exists = workspaces.some((w) => w.id === id);
    if (!exists) return;
    setActive(id);
  }, [id, workspaces, setActive, isHydrated]);

  // While hydrating, render children; they can show their own loading state.
  // After hydration, if the workspace id isn't in the store, 404.
  if (isHydrated && id && !workspaces.some((w) => w.id === id)) {
    notFound();
  }

  return <>{children}</>;
}

"use client";

import { useEffect } from "react";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { usePlaygroundStore } from "@/store/playground-store";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ workspaceId: string }>();
  const workspaceId = params.workspaceId;
  const setActiveWorkspace = usePlaygroundStore((s) => s.setActiveWorkspace);
  const exists = usePlaygroundStore((s) => s.workspaces.some((w) => w.workspace.id === workspaceId));
  const persona = usePlaygroundStore((s) => s.persona);

  useEffect(() => {
    if (exists) setActiveWorkspace(workspaceId);
  }, [workspaceId, exists, setActiveWorkspace]);

  if (persona === null) return null;
  if (!exists) return notFound();

  return <div className="flex-1 flex flex-col">{children}</div>;
}

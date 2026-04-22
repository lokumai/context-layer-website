"use client";

import { usePlaygroundStore } from "@/store/playground-store";
import { CommandPalette } from "./command-palette";

export function CommandPaletteMount() {
  const activeWorkspaceId = usePlaygroundStore((s) => s.activeWorkspaceId);
  return <CommandPalette workspaceId={activeWorkspaceId} />;
}

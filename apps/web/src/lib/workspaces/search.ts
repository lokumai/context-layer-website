import type { RuntimeWorkspace } from "@/stores/types";

// Pure substring filter for the Workspaces page. Extracted so we can
// unit-test it without mounting React. Matches `name` or `description`
// case-insensitively. Empty / whitespace-only queries return everything.

export function filterWorkspaces(
  workspaces: readonly RuntimeWorkspace[],
  query: string,
): RuntimeWorkspace[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...workspaces];
  return workspaces.filter((w) => {
    if (w.name.toLowerCase().includes(q)) return true;
    if ((w.description ?? "").toLowerCase().includes(q)) return true;
    return false;
  });
}

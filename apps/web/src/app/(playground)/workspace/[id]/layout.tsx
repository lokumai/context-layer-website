import { connection } from "next/server";
import { WorkspaceScopeClient } from "@/components/playground/workspace-scope-client";

// Calling connection() here opts the entire [id] subtree out of static prerendering.
// This is the Next.js 16 canonical way to force dynamic rendering for a route segment
// when the route depends on request-time state (Zustand/session).
export default async function WorkspaceScopeLayout({ children }: { children: React.ReactNode }) {
  await connection();
  return <WorkspaceScopeClient>{children}</WorkspaceScopeClient>;
}

import { NextResponse } from "next/server";
import {
  getLlmsTxt,
  getSagaFlows,
  getWikiTree,
  getWorkspaceNarrative,
  listSources,
} from "@context-layer/mocks";
import { auth } from "@/auth";

// Narrow fetch — returns the full wiki substrate regardless of persona.
// Used by the Configure tab after the user generates their first Wiki so the
// `partial` persona can populate the wiki slice without touching bootstrap.

export async function GET() {
  const session = await auth();
  if (!session?.user?.personaId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [sources, narrative, sagaFlows] = await Promise.all([
    listSources(),
    getWorkspaceNarrative(),
    getSagaFlows(),
  ]);

  const treeEntries = await Promise.all(
    sources.map(async (s) => [s.id, await getWikiTree(s.id)] as const),
  );
  const tree = Object.fromEntries(treeEntries);

  const masterLlms = await getLlmsTxt(null);
  const perRepoLlms = await Promise.all(
    sources.map(async (s) => [s.id, await getLlmsTxt(s.id)] as const),
  );
  const llms = Object.fromEntries([["_workspace", masterLlms], ...perRepoLlms]);

  return NextResponse.json({ tree, narrative, sagaFlows, llms });
}

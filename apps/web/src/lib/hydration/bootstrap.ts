import {
  getCannedQA,
  getCoverage,
  getDependencies,
  getHealth,
  getKnowledgeGraph,
  getLlmsTxt,
  getSagaFlows,
  getSecurity,
  getSuggestedPrompts,
  getWikiTree,
  getWorkspace,
  getWorkspaceNarrative,
  listArtifacts,
  listJobs,
  listSources,
} from "@context-layer/mocks";
import type { HydrationPayload } from "@/stores/types";
import type { PersonaId } from "@/lib/personas";

// The single branch-point where persona-specific state is projected from the
// Phase 3 mock loaders. Downstream phases swap these loader calls for real
// backend calls — nothing in the store or the UI needs to change.

const EMPTY: HydrationPayload = {
  workspaces: [],
  sources: [],
  wiki: null,
  intelligence: null,
  artifacts: [],
  chatbot: null,
  activity: [],
};

export async function bootstrapPayload(persona: PersonaId): Promise<HydrationPayload> {
  if (persona === "empty") return EMPTY;

  const [workspace, sources] = await Promise.all([getWorkspace(), listSources()]);

  if (persona === "partial") {
    // Sources added, Wiki not yet generated. Per UI_UX §9.9, this keeps Wiki
    // Configure reachable but Wiki View / Intelligence / Generate / Library
    // locked until the first generation completes.
    return {
      ...EMPTY,
      workspaces: [
        {
          ...workspace,
          syncStatus: "outdated",
          hasWiki: false,
          graduated: false,
          hasIntelligence: false,
          intelligenceRefreshedAt: null,
        },
      ],
      sources,
    };
  }

  // full — load everything.
  const [
    narrative,
    sagaFlows,
    health,
    security,
    coverage,
    dependencies,
    knowledgeGraph,
    artifacts,
    suggestedPrompts,
    cannedQA,
    jobs,
  ] = await Promise.all([
    getWorkspaceNarrative(),
    getSagaFlows(),
    getHealth(),
    getSecurity(),
    getCoverage(),
    getDependencies(),
    getKnowledgeGraph(),
    listArtifacts(),
    getSuggestedPrompts(),
    getCannedQA(),
    listJobs(),
  ]);

  const treeEntries = await Promise.all(
    sources.map(async (s) => [s.id, await getWikiTree(s.id)] as const),
  );
  const wikiTrees = Object.fromEntries(treeEntries);

  const masterLlms = await getLlmsTxt(null);
  const llmsEntries = await Promise.all(
    sources.map(async (s) => [s.id, await getLlmsTxt(s.id)] as const),
  );
  const llms = Object.fromEntries([["_workspace", masterLlms], ...llmsEntries]);

  return {
    workspaces: [
      {
        ...workspace,
        hasWiki: true,
        graduated: true,
        hasIntelligence: true,
        intelligenceRefreshedAt: new Date().toISOString(),
      },
    ],
    sources,
    wiki: { tree: wikiTrees, narrative, sagaFlows, llms },
    intelligence: { health, security, coverage, dependencies, knowledgeGraph },
    artifacts,
    chatbot: { suggestedPrompts, cannedQA, threads: [] },
    activity: jobs,
  };
}

// Public entry point. Consumers import from "@context-layer/mocks".
// Loader functions are the service abstraction; swapping mocks for real
// backends is done by re-implementing these, nothing above changes.

export * from "./types.js";

export { getWorkspace, getWorkspaceNarrative, getSagaFlows } from "./loaders/workspace.js";
export { listSources, getSource } from "./loaders/sources.js";
export { getWikiTree, getWikiPage, getLlmsTxt } from "./loaders/wiki.js";
export {
  getHealth,
  getSecurity,
  getCoverage,
  getDependencies,
  getKnowledgeGraph,
} from "./loaders/intelligence.js";
export { listArtifacts, getArtifact } from "./loaders/artifacts.js";
export { getSuggestedPrompts, getCannedQA } from "./loaders/chatbot.js";
export { listJobs } from "./loaders/activity.js";
export { getManifest } from "./loaders/manifest.js";

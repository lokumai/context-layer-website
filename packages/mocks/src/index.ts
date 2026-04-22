// Public entry point. Consumers import from "@context-layer/mocks".
// Loader functions are the service abstraction; swapping mocks for real
// backends is done by re-implementing these, nothing above changes.

export * from "./types";

export { getWorkspace, getWorkspaceNarrative, getSagaFlows } from "./loaders/workspace";
export { listSources, getSource } from "./loaders/sources";
export { getWikiTree, getWikiPage, getLlmsTxt } from "./loaders/wiki";
export {
  getHealth,
  getSecurity,
  getCoverage,
  getDependencies,
  getKnowledgeGraph,
} from "./loaders/intelligence";
export { listArtifacts, getArtifact } from "./loaders/artifacts";
export { getSuggestedPrompts, getCannedQA } from "./loaders/chatbot";
export { listJobs } from "./loaders/activity";
export { getManifest } from "./loaders/manifest";

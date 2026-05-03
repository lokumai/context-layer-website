#!/usr/bin/env bun
// Re-generation harness for @context-layer/mocks.
//
// The actual data under ../../data/ was produced by an AI agent invoking
// DeepWiki MCP tools directly during Phase 3. This script documents the prompts
// that were used and provides a stub that future re-runs can fill in when we
// swap DeepWiki for a live backend.
//
// Usage: `bun src/scripts/generate.ts` (prints the plan; does not write files).

const PROMPTS = {
  workspaceNarrative:
    "Produce a comprehensive workspace-level narrative (8-12 sections, ~6000 words) that explains the WHOLE multi-repo system as if the 9 logical parts each lived in a separate repository. Cover business domain, logical split, high-level architecture (CQRS, events, outbox, sagas, zero-trust), frontend→services via gateway, inter-service events, chassis conventions, dev/ops, testing posture, and what makes this hard for single-repo wiki tools.",
  sagaFlows:
    "Describe in depth the end-to-end distributed sagas that span multiple services. Focus on at least three concrete sagas (offering publication, transactional outbox publishing, zero-trust JWT validation). For each show trigger, participants, pattern, outbox emissions, compensations, and a mermaid sequenceDiagram timeline.",
  perRepoWiki: (id: string) =>
    `For the ${id} service ONLY: write a detailed repository-level wiki in four markdown sections (Overview, Architecture, Endpoints, Testing). Each section ≥400 words. H1 with the service title. Reference real files and approximate line ranges.`,
} as const;

const REPO_IDS = [
  "api-gateway",
  "identity-service",
  "characteristic-service",
  "specification-service",
  "pricing-service",
  "offering-service",
  "store-query-service",
  "frontend",
  "shared-chassis",
] as const;

console.log("── @context-layer/mocks generation plan ─────────────────────");
console.log(`Target repo : amirkiarafiei/microservices-product-catalog`);
console.log(`Sources      : ${REPO_IDS.length}`);
console.log();
console.log("Prompts used:");
console.log(" workspace narrative ──");
console.log(`  ${PROMPTS.workspaceNarrative}`);
console.log();
console.log(" saga flows ──");
console.log(`  ${PROMPTS.sagaFlows}`);
console.log();
console.log(" per-repo wikis ──");
for (const id of REPO_IDS) {
  console.log(`  [${id}] ${PROMPTS.perRepoWiki(id)}`);
}
console.log();
console.log(
  "Intelligence metrics, DocsGen artifacts, chatbot Q&A, and the job log " +
    "are hand-authored in concert with the wiki content; see data/ for the " +
    "committed outputs.",
);
console.log();
console.log(
  "This harness is a stub — wire it to a live DeepWiki client to " +
    "actually re-generate the dataset.",
);

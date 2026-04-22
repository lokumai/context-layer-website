#!/usr/bin/env bun
// Walks every loader and asserts integrity invariants documented in
// packages/mocks/src/__tests__ (this script is the one-shot "does everything
// resolve?" check for CI and for humans).
//
// Usage: `bun src/scripts/verify.ts` — exits non-zero on any failure.

import { stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

import {
  getCannedQA,
  getCoverage,
  getDependencies,
  getHealth,
  getKnowledgeGraph,
  getLlmsTxt,
  getManifest,
  getSagaFlows,
  getSecurity,
  getSuggestedPrompts,
  getWikiTree,
  getWorkspace,
  getWorkspaceNarrative,
  listArtifacts,
  listJobs,
  listSources,
} from "../index";

const here = dirname(fileURLToPath(import.meta.url));
const DATA_ROOT = join(here, "..", "..", "data");

let failures = 0;
function ok(label: string) {
  console.log(`  ✓ ${label}`);
}
function fail(label: string, err: unknown) {
  failures++;
  console.error(`  ✗ ${label}`);
  console.error(`      ${err instanceof Error ? err.message : String(err)}`);
}
async function exists(relPath: string): Promise<boolean> {
  try {
    await stat(join(DATA_ROOT, relPath));
    return true;
  } catch {
    return false;
  }
}

console.log("@context-layer/mocks — data integrity check\n");

try {
  console.log("Workspace");
  const ws = await getWorkspace();
  if (ws.sourceCount !== 9) throw new Error(`expected 9 sources, got ${ws.sourceCount}`);
  ok(`workspace "${ws.name}" (${ws.sourceCount} sources)`);

  const narrative = await getWorkspaceNarrative();
  if (narrative.markdown.length < 2000) throw new Error("narrative suspiciously short");
  ok(`narrative (${narrative.tokenCount} tokens, ${narrative.sections.length} sections)`);

  const saga = await getSagaFlows();
  if (saga.markdown.length < 1500) throw new Error("saga-flows suspiciously short");
  ok(`saga flows (${saga.tokenCount} tokens)`);
} catch (err) {
  fail("workspace", err);
}

try {
  console.log("\nSources");
  const sources = await listSources();
  if (sources.length !== 9) throw new Error(`expected 9, got ${sources.length}`);
  for (const s of sources) {
    if (!(await exists(join("repos", s.id)))) {
      throw new Error(`source ${s.id} has no matching repo dir`);
    }
  }
  ok(`${sources.length} sources, each has a repos/<id>/ directory`);
} catch (err) {
  fail("sources", err);
}

try {
  console.log("\nPer-repo wikis + llms.txt");
  const sources = await listSources();
  let totalPages = 0;
  for (const s of sources) {
    const tree = await getWikiTree(s.id);
    if (tree.nodes.length < 1) throw new Error(`${s.id} has zero wiki pages`);
    totalPages += countNodes(tree.nodes);
    const repoLlms = await getLlmsTxt(s.id);
    if (repoLlms.markdown.length < 100) throw new Error(`${s.id} llms.txt is empty`);
  }
  const masterLlms = await getLlmsTxt(null);
  if (masterLlms.markdown.length < 200) throw new Error("master llms-txt is empty");
  ok(`${totalPages} wiki pages across 9 repos; master llms.txt present`);
} catch (err) {
  fail("wiki", err);
}

try {
  console.log("\nIntelligence");
  const h = await getHealth();
  if (h.perRepo.length !== 9) throw new Error(`health perRepo=${h.perRepo.length}, expected 9`);
  const sec = await getSecurity();
  if (sec.findings.length < 10) throw new Error(`security findings=${sec.findings.length}`);
  const cov = await getCoverage();
  if (cov.perRepo.length !== 9) throw new Error(`coverage perRepo=${cov.perRepo.length}`);
  const dep = await getDependencies();
  if (dep.nodes.length < 10) throw new Error("dependency nodes suspiciously few");
  const graph = await getKnowledgeGraph();
  if (graph.nodes.length < 9 || graph.edges.length < 10) throw new Error("knowledge graph too thin");
  ok(`health(${h.overallScore}) · security(${sec.findings.length} findings) · coverage(${cov.overall}%)`);
  ok(`graph: ${graph.nodes.length} nodes / ${graph.edges.length} edges`);
} catch (err) {
  fail("intelligence", err);
}

try {
  console.log("\nDocsGen artifacts");
  const all = await listArtifacts();
  const bundles = new Set(all.map((a) => a.bundle));
  if (bundles.size < 5) throw new Error(`only ${bundles.size} bundles populated`);
  for (const a of all) {
    if (a.markdown.length < 500) throw new Error(`artifact ${a.id} content suspiciously short`);
  }
  ok(`${all.length} artifacts across ${bundles.size} bundles`);
} catch (err) {
  fail("artifacts", err);
}

try {
  console.log("\nChatbot");
  const prompts = await getSuggestedPrompts();
  if (prompts.length < 5) throw new Error(`only ${prompts.length} prompts`);
  const qa = await getCannedQA();
  if (qa.length < 10) throw new Error(`only ${qa.length} Q&A pairs`);
  // Dual-citation invariant: at least one Q&A must have both kinds.
  const hasDual = qa.some(
    (p) => p.citations.some((c) => c.kind === "wiki") && p.citations.some((c) => c.kind === "code"),
  );
  if (!hasDual) throw new Error("no Q&A pair has both wiki and code citations");
  ok(`${prompts.length} prompts · ${qa.length} Q&A pairs · dual-citation invariant holds`);
} catch (err) {
  fail("chatbot", err);
}

try {
  console.log("\nActivity");
  const jobs = await listJobs();
  if (jobs.length < 5) throw new Error(`only ${jobs.length} jobs`);
  ok(`${jobs.length} jobs in timeline`);
} catch (err) {
  fail("activity", err);
}

try {
  console.log("\nManifest");
  const m = await getManifest();
  if (m.counts.sources !== 9) throw new Error("manifest sources != 9");
  ok(`manifest v${m.version} generated ${m.generatedAt}`);
} catch (err) {
  fail("manifest", err);
}

console.log();
if (failures === 0) {
  console.log("All integrity checks passed.");
  process.exit(0);
} else {
  console.error(`${failures} failure(s).`);
  process.exit(1);
}

function countNodes(nodes: Array<{ children?: Array<unknown> }>): number {
  let n = 0;
  for (const node of nodes) {
    n++;
    if ("children" in node && Array.isArray(node.children)) {
      n += countNodes(node.children as Array<{ children?: Array<unknown> }>);
    }
  }
  return n;
}

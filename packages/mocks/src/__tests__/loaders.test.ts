import { describe, expect, it } from "vitest";

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
  getSource,
  getSuggestedPrompts,
  getWikiTree,
  getWorkspace,
  getWorkspaceNarrative,
  listArtifacts,
  listJobs,
  listSources,
} from "../index.js";

describe("@context-layer/mocks loaders", () => {
  it("workspace: exposes the microservices-product-catalog workspace", async () => {
    const ws = await getWorkspace();
    expect(ws.id).toBe("ws-microservices-product-catalog");
    expect(ws.sourceCount).toBe(9);
    expect(ws.syncStrategy).toMatch(/per-pr-merge|per-commit|hourly|daily|weekly|manual/);
  });

  it("workspace: narrative is substantial and has sections", async () => {
    const n = await getWorkspaceNarrative();
    expect(n.markdown.length).toBeGreaterThan(2000);
    expect(n.sections.length).toBeGreaterThan(3);
  });

  it("workspace: saga-flows doc is present and meaningful", async () => {
    const s = await getSagaFlows();
    expect(s.markdown).toContain("Camunda");
    expect(s.markdown.length).toBeGreaterThan(1500);
  });

  it("sources: lists exactly 9 sources", async () => {
    const s = await listSources();
    expect(s).toHaveLength(9);
    const ids = s.map((x) => x.id).sort();
    expect(ids).toEqual(
      [
        "api-gateway",
        "characteristic-service",
        "frontend",
        "identity-service",
        "offering-service",
        "pricing-service",
        "shared-chassis",
        "specification-service",
        "store-query-service",
      ].sort(),
    );
  });

  it("sources: getSource throws for unknown id", async () => {
    await expect(getSource("does-not-exist")).rejects.toThrow(/not found/);
  });

  it("sources: every source URL points at the real monorepo subpath", async () => {
    const s = await listSources();
    for (const src of s) {
      expect(src.url).toContain("amirkiarafiei/microservices-product-catalog");
      expect(src.url).toContain(src.path);
    }
  });

  it("wiki: every source has a readable tree and at least one page", async () => {
    const sources = await listSources();
    for (const src of sources) {
      const tree = await getWikiTree(src.id);
      expect(tree.repoId).toBe(src.id);
      expect(tree.nodes.length).toBeGreaterThan(0);
    }
  });

  it("wiki: every source has a repo-level llms.txt", async () => {
    const sources = await listSources();
    for (const src of sources) {
      const l = await getLlmsTxt(src.id);
      expect(l.repoId).toBe(src.id);
      expect(l.markdown.length).toBeGreaterThan(100);
    }
  });

  it("wiki: master llms.txt exists", async () => {
    const l = await getLlmsTxt(null);
    expect(l.repoId).toBeNull();
    expect(l.markdown).toContain("Microservices Product Catalog");
  });

  it("intelligence: health has per-repo entry for every source", async () => {
    const h = await getHealth();
    const sources = await listSources();
    const healthIds = new Set(h.perRepo.map((x) => x.repoId));
    for (const s of sources) expect(healthIds.has(s.id)).toBe(true);
    expect(h.overallScore).toBeGreaterThan(0);
    expect(h.overallScore).toBeLessThanOrEqual(100);
  });

  it("intelligence: security findings reference valid repoIds", async () => {
    const sec = await getSecurity();
    const sources = await listSources();
    const srcIds = new Set(sources.map((s) => s.id));
    expect(sec.findings.length).toBeGreaterThanOrEqual(10);
    for (const f of sec.findings) expect(srcIds.has(f.repoId)).toBe(true);
  });

  it("intelligence: coverage covers every source", async () => {
    const c = await getCoverage();
    expect(c.perRepo).toHaveLength(9);
    for (const r of c.perRepo) {
      expect(r.lineCoverage).toBeGreaterThan(0);
      expect(r.lineCoverage).toBeLessThanOrEqual(100);
    }
  });

  it("intelligence: dependencies graph is non-trivial", async () => {
    const d = await getDependencies();
    expect(d.nodes.length).toBeGreaterThan(15);
    expect(d.outdatedCount).toBeGreaterThan(0);
  });

  it("intelligence: knowledge graph nodes include every source id", async () => {
    const g = await getKnowledgeGraph();
    const sources = await listSources();
    const nodeIds = new Set(g.nodes.map((n) => n.id));
    for (const s of sources) expect(nodeIds.has(s.id)).toBe(true);
    expect(g.edges.length).toBeGreaterThan(10);
  });

  it("artifacts: every bundle from UI_UX is represented", async () => {
    const all = await listArtifacts();
    const bundles = new Set(all.map((a) => a.bundle));
    for (const b of [
      "structure-architecture",
      "specification-knowledge",
      "health-risk",
      "agentify",
      "institutional-memory",
      "research-docs",
    ]) {
      expect(bundles.has(b as (typeof all)[number]["bundle"])).toBe(true);
    }
    expect(all.length).toBeGreaterThanOrEqual(20);
  });

  it("artifacts: every artifact hydrates its markdown", async () => {
    const all = await listArtifacts();
    for (const a of all) expect(a.markdown.length).toBeGreaterThan(500);
  });

  it("artifacts: filter by bundle", async () => {
    const agentify = await listArtifacts("agentify");
    expect(agentify.length).toBeGreaterThan(0);
    for (const a of agentify) expect(a.bundle).toBe("agentify");
  });

  it("chatbot: suggested prompts and Q&A are non-empty", async () => {
    const prompts = await getSuggestedPrompts();
    const qa = await getCannedQA();
    expect(prompts.length).toBeGreaterThan(5);
    expect(qa.length).toBeGreaterThanOrEqual(10);
  });

  it("chatbot: at least one Q&A has BOTH wiki and code citations (dual-citation invariant)", async () => {
    const qa = await getCannedQA();
    const hasDual = qa.some(
      (p) =>
        p.citations.some((c) => c.kind === "wiki") &&
        p.citations.some((c) => c.kind === "code"),
    );
    expect(hasDual).toBe(true);
  });

  it("chatbot: every code citation references a known source id", async () => {
    const qa = await getCannedQA();
    const sourceIds = new Set((await listSources()).map((s) => s.id));
    for (const p of qa) {
      for (const c of p.citations) {
        if (c.kind === "code") {
          const repoId = c.repoId;
          expect(repoId).toBeDefined();
          if (repoId) expect(sourceIds.has(repoId)).toBe(true);
          expect(c.lineRange).toBeDefined();
        }
      }
    }
  });

  it("activity: jobs timeline has multiple statuses and types", async () => {
    const jobs = await listJobs();
    expect(jobs.length).toBeGreaterThanOrEqual(5);
    const types = new Set(jobs.map((j) => j.type));
    expect(types.size).toBeGreaterThan(1);
  });

  it("manifest: counts match loader outputs", async () => {
    const m = await getManifest();
    const sources = await listSources();
    const all = await listArtifacts();
    const qa = await getCannedQA();
    const jobs = await listJobs();
    expect(m.counts.sources).toBe(sources.length);
    expect(m.counts.artifacts).toBe(all.length);
    expect(m.counts.cannedQA).toBe(qa.length);
    expect(m.counts.jobs).toBe(jobs.length);
  });
});

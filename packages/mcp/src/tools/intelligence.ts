import {
  getCoverage,
  getDependencies,
  getHealth,
  getKnowledgeGraph,
  getSecurity,
} from "@context-layer/mocks";
import type { ToolTextResponse } from "./wiki";

export type IntelligenceTopic =
  | "overview"
  | "health"
  | "security"
  | "coverage"
  | "dependencies"
  | "graph";

export interface IntelligenceToolInput {
  topic: IntelligenceTopic;
  repoId?: string;
}

// Returns structured intelligence data as a JSON-stringified text block so
// clients can either parse it or display it verbatim. When `repoId` is
// supplied, per-repo collections are narrowed; workspace-level scalars
// (overall coverage %, overall health score) are always included.

export async function getCodeIntelligence(input: IntelligenceToolInput): Promise<ToolTextResponse> {
  const { topic, repoId } = input;
  const payload = await buildPayload(topic, repoId);
  return {
    content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
  };
}

async function buildPayload(topic: IntelligenceTopic, repoId?: string) {
  switch (topic) {
    case "overview": {
      const [health, security, coverage, dependencies, graph] = await Promise.all([
        getHealth(),
        getSecurity(),
        getCoverage(),
        getDependencies(),
        getKnowledgeGraph(),
      ]);
      // Phase 18: per-repo triage row so an agent can drill in straight away.
      const repoIds = new Set<string>();
      for (const r of health.perRepo) repoIds.add(r.repoId);
      for (const r of coverage.perRepo) repoIds.add(r.repoId);
      const repos = [...repoIds].sort().map((id) => {
        const h = health.perRepo.find((x) => x.repoId === id);
        const c = coverage.perRepo.find((x) => x.repoId === id);
        const findings = security.findings.filter((f) => f.repoId === id).length;
        return {
          repoId: id,
          healthScore: h?.score ?? null,
          openFindings: findings,
          coverage: c?.lineCoverage ?? null,
        };
      });
      return {
        health: { overallScore: health.overallScore, summary: health.summary },
        security: { summary: security.summary, findingCount: security.findings.length },
        coverage: { overall: coverage.overall, repoCount: coverage.perRepo.length },
        dependencies: {
          outdatedCount: dependencies.outdatedCount,
          crossRepoCount: dependencies.crossRepoCount,
          summary: dependencies.summary,
        },
        graph: { nodes: graph.nodes.length, edges: graph.edges.length },
        repos,
      };
    }

    case "health": {
      const health = await getHealth();
      if (!repoId) return health;
      return {
        overallScore: health.overallScore,
        summary: health.summary,
        perRepo: health.perRepo.filter((r) => r.repoId === repoId),
      };
    }

    case "security": {
      const security = await getSecurity();
      if (!repoId) return security;
      const findings = security.findings.filter((f) => f.repoId === repoId);
      return { findings, matchedRepo: repoId, workspaceSummary: security.summary };
    }

    case "coverage": {
      const coverage = await getCoverage();
      if (!repoId) return coverage;
      return {
        overall: coverage.overall,
        perRepo: coverage.perRepo.filter((r) => r.repoId === repoId),
      };
    }

    case "dependencies": {
      const deps = await getDependencies();
      if (!repoId) return deps;
      return {
        crossRepoCount: deps.crossRepoCount,
        outdatedCount: deps.outdatedCount,
        summary: deps.summary,
        nodes: deps.nodes.filter((n) => n.repoId === repoId),
      };
    }

    case "graph": {
      const graph = await getKnowledgeGraph();
      if (!repoId) return graph;
      const nodes = graph.nodes.filter((n) => n.repoId === repoId);
      const ids = new Set(nodes.map((n) => n.id));
      const edges = graph.edges.filter((e) => ids.has(e.source) || ids.has(e.target));
      return { nodes, edges, scopedTo: repoId };
    }
  }
}

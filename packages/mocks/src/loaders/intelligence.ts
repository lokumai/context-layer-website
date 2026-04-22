import type {
  CoverageReport,
  DependencyReport,
  HealthMetric,
  KnowledgeGraph,
  SecurityReport,
} from "../types.js";
import { readJSON } from "./_fs.js";

export async function getHealth(): Promise<HealthMetric> {
  return readJSON<HealthMetric>("intelligence/health.json");
}

export async function getSecurity(): Promise<SecurityReport> {
  return readJSON<SecurityReport>("intelligence/security.json");
}

export async function getCoverage(): Promise<CoverageReport> {
  return readJSON<CoverageReport>("intelligence/coverage.json");
}

export async function getDependencies(): Promise<DependencyReport> {
  return readJSON<DependencyReport>("intelligence/dependencies.json");
}

export async function getKnowledgeGraph(): Promise<KnowledgeGraph> {
  return readJSON<KnowledgeGraph>("intelligence/knowledge-graph.json");
}

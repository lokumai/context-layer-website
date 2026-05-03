import { join } from "node:path";
import type { Artifact, ArtifactBundle } from "../types";
import { readJSON, readText } from "./_fs";

interface ArtifactIndex {
  artifacts: Array<Omit<Artifact, "markdown">>;
}

let cachedIndex: Artifact[] | null = null;

async function loadAll(): Promise<Artifact[]> {
  if (cachedIndex) return cachedIndex;
  const idx = await readJSON<ArtifactIndex>("artifacts/index.json");
  const hydrated: Artifact[] = [];
  for (const meta of idx.artifacts) {
    const md = await readText(join("artifacts", meta.bundle, meta.id, "content.md"));
    // Stamp the provenance field — every Phase 3 artifact was DocsGen-produced.
    // OmniBoard runtime-generates its own with tool: "omniboard".
    hydrated.push({ tool: "docsgen", ...meta, markdown: md });
  }
  cachedIndex = hydrated;
  return hydrated;
}

export async function listArtifacts(bundle?: ArtifactBundle): Promise<Artifact[]> {
  const all = await loadAll();
  return bundle ? all.filter((a) => a.bundle === bundle) : all;
}

export async function getArtifact(id: string): Promise<Artifact> {
  const all = await loadAll();
  const hit = all.find((a) => a.id === id);
  if (!hit) throw new Error(`@context-layer/mocks: artifact not found: ${id}`);
  return hit;
}

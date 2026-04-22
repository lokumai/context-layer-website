import type { Source } from "../types.js";
import { readJSON } from "./_fs.js";

interface SourcesFile {
  sources: Source[];
}

export async function listSources(): Promise<Source[]> {
  const file = await readJSON<SourcesFile>("sources/sources.json");
  return file.sources;
}

export async function getSource(id: string): Promise<Source> {
  const all = await listSources();
  const found = all.find((s) => s.id === id);
  if (!found) throw new Error(`@context-layer/mocks: source not found: ${id}`);
  return found;
}

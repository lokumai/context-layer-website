// Shared filesystem helpers for loaders.
// The mocks are shipped as files inside the package; loaders resolve paths
// relative to this file so they work regardless of the consumer's cwd.

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
/** Absolute path to packages/mocks/data/ */
export const DATA_ROOT = join(here, "..", "..", "data");

const cache = new Map<string, unknown>();

export async function readJSON<T>(relPath: string): Promise<T> {
  const abs = join(DATA_ROOT, relPath);
  const hit = cache.get(abs);
  if (hit !== undefined) return hit as T;
  const raw = await readFile(abs, "utf8");
  const parsed = JSON.parse(raw) as T;
  cache.set(abs, parsed);
  return parsed;
}

export async function readText(relPath: string): Promise<string> {
  const abs = join(DATA_ROOT, relPath);
  const hit = cache.get(abs);
  if (hit !== undefined) return hit as string;
  const raw = await readFile(abs, "utf8");
  cache.set(abs, raw);
  return raw;
}

/** Approximate token count: markdown word-count * 1.3 (rough OpenAI heuristic). */
export function approxTokens(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.round(words * 1.3);
}

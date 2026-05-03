import { join } from "node:path";
import type { LlmsTxt, WikiPage, WikiTree } from "../types";
import { approxTokens, readJSON, readText } from "./_fs";

export async function getWikiTree(repoId: string): Promise<WikiTree> {
  return readJSON<WikiTree>(join("repos", repoId, "wiki", "tree.json"));
}

export async function getWikiPage(repoId: string, slug: string): Promise<WikiPage> {
  const tree = await getWikiTree(repoId);
  const node = findNode(tree.nodes, slug);
  if (!node) throw new Error(`@context-layer/mocks: wiki page not found: ${repoId}/${slug}`);
  const md = await readText(join("repos", repoId, "wiki", node.file));
  return { repoId, slug, title: node.title, markdown: md, tokenCount: approxTokens(md) };
}

export async function getLlmsTxt(repoId: string | null): Promise<LlmsTxt> {
  const rel = repoId === null ? join("llms-txt", "index.md") : join("repos", repoId, "llms.txt");
  const md = await readText(rel);
  return { repoId, markdown: md };
}

function findNode(nodes: WikiTree["nodes"], slug: string): WikiTree["nodes"][number] | null {
  for (const n of nodes) {
    if (n.slug === slug) return n;
    if (n.children) {
      const hit = findNode(n.children, slug);
      if (hit) return hit;
    }
  }
  return null;
}

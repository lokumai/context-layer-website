import type { SagaFlowsDoc, Workspace, WorkspaceNarrative } from "../types";
import { approxTokens, readJSON, readText } from "./_fs";

export async function getWorkspace(): Promise<Workspace> {
  return readJSON<Workspace>("workspace/workspace.json");
}

export async function getWorkspaceNarrative(): Promise<WorkspaceNarrative> {
  const md = await readText("workspace/narrative.md");
  const sections = extractHeadings(md);
  return { markdown: md, tokenCount: approxTokens(md), sections };
}

export async function getSagaFlows(): Promise<SagaFlowsDoc> {
  const md = await readText("workspace/saga-flows.md");
  return { markdown: md, tokenCount: approxTokens(md) };
}

function extractHeadings(md: string): Array<{ slug: string; title: string }> {
  const out: Array<{ slug: string; title: string }> = [];
  for (const line of md.split("\n")) {
    const m = /^(#{1,3})\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const title = m[2].trim();
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    out.push({ slug, title });
  }
  return out;
}

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { beforeAll, describe, expect, it } from "vitest";
import { createMcpServer } from "../server";

let client: Client;

beforeAll(async () => {
  const server = createMcpServer();
  const [clientT, serverT] = InMemoryTransport.createLinkedPair();
  client = new Client({ name: "test-client", version: "0.0.0" });
  await Promise.all([server.connect(serverT), client.connect(clientT)]);
});

function textOf(result: { content: Array<{ type: string; text?: string }> }): string {
  return result.content
    .filter((c) => c.type === "text")
    .map((c) => c.text ?? "")
    .join("\n");
}

describe("createMcpServer", () => {
  it("advertises exactly three tools", async () => {
    const { tools } = await client.listTools();
    const names = tools.map((t) => t.name).sort();
    expect(names).toEqual(["ask_context_layer", "get_code_intelligence", "get_wiki_content"]);
  });

  it("get_wiki_content (scope: workspace) returns narrative + saga flows + Available repos index", async () => {
    const result = await client.callTool({
      name: "get_wiki_content",
      arguments: { scope: "workspace" },
    });
    const text = textOf(result as never);
    expect(text).toContain("Workspace narrative");
    expect(text).toContain("Saga flows");
    // Phase 18: "Available repos" section with a per-repo follow-up suggestion.
    expect(text).toContain("Available repos");
    expect(text).toMatch(/Call `get_wiki_content` with `scope:"repo"/);
    expect(text.length).toBeGreaterThan(500);
  });

  it("get_wiki_content (scope: page) returns a wiki page's markdown", async () => {
    const result = await client.callTool({
      name: "get_wiki_content",
      arguments: { scope: "page", repoId: "api-gateway", slug: "overview" },
    });
    const text = textOf(result as never);
    expect(text.trim().startsWith("#")).toBe(true);
  });

  it("get_code_intelligence (topic: security, repoId: offering-service) narrows findings", async () => {
    const result = await client.callTool({
      name: "get_code_intelligence",
      arguments: { topic: "security", repoId: "offering-service" },
    });
    const text = textOf(result as never);
    const parsed = JSON.parse(text) as {
      findings: Array<{ repoId: string }>;
      matchedRepo: string;
    };
    expect(parsed.matchedRepo).toBe("offering-service");
    expect(Array.isArray(parsed.findings)).toBe(true);
    for (const f of parsed.findings) expect(f.repoId).toBe("offering-service");
  });

  it("get_code_intelligence (topic: overview) returns compact summary + per-repo triage rows", async () => {
    const result = await client.callTool({
      name: "get_code_intelligence",
      arguments: { topic: "overview" },
    });
    const text = textOf(result as never);
    const parsed = JSON.parse(text) as {
      health: { overallScore: number };
      security: { findingCount: number };
      repos: Array<{
        repoId: string;
        healthScore: number | null;
        openFindings: number;
        coverage: number | null;
      }>;
    };
    expect(typeof parsed.health.overallScore).toBe("number");
    expect(parsed.security.findingCount).toBeGreaterThan(0);
    // Phase 18: per-repo triage row.
    expect(Array.isArray(parsed.repos)).toBe(true);
    expect(parsed.repos.length).toBeGreaterThan(0);
    for (const r of parsed.repos) {
      expect(typeof r.repoId).toBe("string");
      expect(typeof r.openFindings).toBe("number");
    }
  });

  it("ask_context_layer matches a canned question and includes citations grouped by kind", async () => {
    const result = await client.callTool({
      name: "ask_context_layer",
      arguments: { question: "How does the Transactional Outbox pattern work in this codebase?" },
    });
    const text = textOf(result as never);
    expect(text.toLowerCase()).toContain("outbox");
    // Phase 18: citations are grouped by kind (Wiki / Code / File).
    expect(text).toContain("Citations");
    expect(text).toMatch(/Wiki references:|Code references:|File references:/);
  });

  it("ask_context_layer returns a graceful fallback with suggested prompts", async () => {
    const result = await client.callTool({
      name: "ask_context_layer",
      arguments: { question: "What is the capital of France?" },
    });
    const text = textOf(result as never);
    expect(text).toMatch(/don't have a grounded answer/i);
    expect(text).toContain("Suggested starter questions");
  });
});

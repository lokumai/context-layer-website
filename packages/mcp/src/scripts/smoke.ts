#!/usr/bin/env bun
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createMcpServer } from "../server";

// Standalone smoke runner: boots an in-memory client/server pair, calls
// each of the three tools with representative arguments, and prints the
// results. Exits 0 on success, 1 on any throw. Mirrors packages/mocks's
// verify.ts pattern.

interface ToolResult {
  content: Array<{ type: string; text?: string }>;
}

function textOf(r: ToolResult): string {
  return r.content
    .filter((c) => c.type === "text")
    .map((c) => c.text ?? "")
    .join("\n");
}

function section(title: string, body: string): void {
  console.log(`\n${"=".repeat(72)}`);
  console.log(title);
  console.log("=".repeat(72));
  const trimmed =
    body.length > 600 ? `${body.slice(0, 600)}\n...(${body.length - 600} chars trimmed)` : body;
  console.log(trimmed);
}

async function main() {
  const server = createMcpServer();
  const [clientT, serverT] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "smoke", version: "0.0.0" });
  await Promise.all([server.connect(serverT), client.connect(clientT)]);

  const { tools } = await client.listTools();
  section(
    "listTools",
    tools.map((t) => `- ${t.name}: ${t.description?.slice(0, 80) ?? ""}`).join("\n"),
  );

  const wikiWs = (await client.callTool({
    name: "get_wiki_content",
    arguments: { scope: "workspace" },
  })) as ToolResult;
  section("get_wiki_content · scope=workspace", textOf(wikiWs));

  const wikiPage = (await client.callTool({
    name: "get_wiki_content",
    arguments: { scope: "page", repoId: "api-gateway", slug: "overview" },
  })) as ToolResult;
  section("get_wiki_content · api-gateway/overview", textOf(wikiPage));

  const intel = (await client.callTool({
    name: "get_code_intelligence",
    arguments: { topic: "overview" },
  })) as ToolResult;
  section("get_code_intelligence · overview", textOf(intel));

  const intelRepo = (await client.callTool({
    name: "get_code_intelligence",
    arguments: { topic: "security", repoId: "offering-service" },
  })) as ToolResult;
  section("get_code_intelligence · security@offering-service", textOf(intelRepo));

  const askHit = (await client.callTool({
    name: "ask_context_layer",
    arguments: { question: "How does the Transactional Outbox pattern work?" },
  })) as ToolResult;
  section("ask_context_layer · outbox (match)", textOf(askHit));

  const askMiss = (await client.callTool({
    name: "ask_context_layer",
    arguments: { question: "What is the capital of France?" },
  })) as ToolResult;
  section("ask_context_layer · unrelated (fallback)", textOf(askMiss));

  await client.close();
  await server.close();
  console.log("\n✓ smoke OK");
}

main().catch((err) => {
  console.error("smoke FAILED:", err);
  process.exit(1);
});

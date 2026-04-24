import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { askContextLayer } from "./tools/ask";
import { getCodeIntelligence } from "./tools/intelligence";
import { getWikiContent } from "./tools/wiki";

export interface McpServerConfig {
  /** Logical workspace id (advisory — mock mode has one). */
  workspace?: string;
  /** Auth token (accepted, ignored in mock mode). */
  token?: string;
}

export function resolveConfig(env: NodeJS.ProcessEnv = process.env): McpServerConfig {
  return {
    workspace: env.CONTEXT_LAYER_WORKSPACE,
    token: env.CONTEXT_LAYER_TOKEN,
  };
}

/**
 * Build a Context Layer MCP server with the three canonical tools
 * (`get_wiki_content`, `get_code_intelligence`, `ask_context_layer`) registered.
 *
 * Callers pick their own transport (stdio for CLI use, in-memory for tests,
 * HTTP for future server-side deployments).
 */
export function createMcpServer(_config: McpServerConfig = resolveConfig()): McpServer {
  const server = new McpServer({
    name: "context-layer",
    version: "1.0.0",
  });

  server.registerTool(
    "get_wiki_content",
    {
      title: "Get Wiki Content",
      description:
        "Fetch indexed workspace knowledge: the workspace narrative, per-repo wiki pages, repo-level wiki trees, or llms.txt indices.",
      inputSchema: {
        scope: z
          .enum(["workspace", "repo", "page", "llms"])
          .describe(
            "`workspace` → narrative + saga flows; `repo` → wiki tree + llms.txt; `page` → single wiki page; `llms` → a repo's or the master llms.txt index.",
          ),
        repoId: z.string().optional().describe("Required for scope `repo` and `page`."),
        slug: z.string().optional().describe("Required for scope `page` — the wiki page slug."),
        llms: z
          .string()
          .optional()
          .describe(
            'Required for scope `llms`. Either a repo id or "_workspace" for the master index.',
          ),
      },
    },
    async (input) => getWikiContent(input),
  );

  server.registerTool(
    "get_code_intelligence",
    {
      title: "Get Code Intelligence",
      description:
        "Read code-health analytics — tech-debt scores, security findings, test coverage, dependency graph, and the knowledge graph — optionally scoped to a single repo.",
      inputSchema: {
        topic: z
          .enum(["overview", "health", "security", "coverage", "dependencies", "graph"])
          .describe("Which analytics slice to return."),
        repoId: z
          .string()
          .optional()
          .describe("When set, narrows per-repo collections to the named repository."),
      },
    },
    async (input) => getCodeIntelligence(input),
  );

  server.registerTool(
    "ask_context_layer",
    {
      title: "Ask Context Layer",
      description:
        "Ask a natural-language question grounded in this workspace's indexed knowledge. Returns a cited answer or (if no confident match) a list of suggested questions.",
      inputSchema: {
        question: z.string().min(1).describe("The question to answer."),
      },
    },
    async (input) => askContextLayer(input),
  );

  return server;
}

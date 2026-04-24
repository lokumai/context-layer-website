# @context-layer/mcp

A [Model Context Protocol](https://modelcontextprotocol.io) server that exposes a Context Layer workspace — its indexed Wiki, code-intelligence analytics, and grounded Q&A — to external AI clients like Claude Desktop, Cursor, and Windsurf.

When connected, an agent can call three tools:

| Tool | What it does |
|---|---|
| `get_wiki_content` | Fetch the workspace narrative, per-repo wiki trees, a single wiki page, or `llms.txt` indices. |
| `get_code_intelligence` | Read health, security, coverage, dependency, or knowledge-graph analytics — optionally scoped to a single repo. |
| `ask_context_layer` | Ask a natural-language question grounded in the indexed knowledge. Returns a cited answer or suggested starter questions. |

This package is the mock-backed MVP — it reads from the `@context-layer/mocks` fixtures baked into the monorepo. The same tool shape is intended to back real workspaces in production.

---

## Install & connect

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or the equivalent on Windows / Linux:

```json
{
  "mcpServers": {
    "context-layer": {
      "command": "npx",
      "args": ["-y", "@context-layer/mcp"],
      "env": {
        "CONTEXT_LAYER_WORKSPACE": "microservices-product-catalog",
        "CONTEXT_LAYER_TOKEN": "<your-token>"
      }
    }
  }
}
```

Restart Claude Desktop; the three tools appear in the tool picker.

### Cursor / Windsurf

Same JSON under the editor's MCP settings. Any client that speaks stdio-based MCP will work.

### Programmatic (Node / Bun)

```ts
import { createMcpServer } from "@context-layer/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = createMcpServer();
await server.connect(new StdioServerTransport());
```

---

## Environment variables

| Var | Purpose |
|---|---|
| `CONTEXT_LAYER_WORKSPACE` | Logical workspace id (advisory in mock mode). |
| `CONTEXT_LAYER_TOKEN` | Auth token — accepted, ignored in mock mode; reserved for production. |

---

## Tool reference

### `get_wiki_content`

```ts
{ scope: "workspace" | "repo" | "page" | "llms", repoId?, slug?, llms? }
```

- `workspace` → workspace narrative + saga-flows markdown.
- `repo` + `repoId` → repo's wiki tree (JSON) + llms.txt.
- `page` + `repoId` + `slug` → single wiki page markdown.
- `llms` + `llms` (repo id or `"_workspace"`) → llms.txt index.

### `get_code_intelligence`

```ts
{ topic: "overview" | "health" | "security" | "coverage" | "dependencies" | "graph", repoId? }
```

Returns JSON-stringified analytics. `overview` is a compact summary combining all five topics. When `repoId` is set, per-repo collections are narrowed.

### `ask_context_layer`

```ts
{ question: string }
```

Matches against the workspace's canned Q&A pairs. On hit, returns the answer + citations. On miss, returns an honest "no grounded answer" + three suggested starter prompts.

---

## Development

```bash
bun install                                  # from repo root
bun --cwd packages/mcp run test              # Vitest
bun --cwd packages/mcp run smoke             # in-process smoke runner
bun --cwd packages/mcp run start             # stdio server (pipe to an MCP client)
```

The stdio entrypoint is `packages/mcp/src/bin.ts`; the barrel export `createMcpServer()` lets you wire any transport.

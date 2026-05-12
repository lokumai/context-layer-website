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

### Running over HTTP

`bun dev` from the monorepo root starts the server automatically on port 8765 with no auth required (local dev mode). To run it standalone:

```bash
bun --cwd packages/mcp run start:http
# → http://localhost:8765/mcp  (auth: open)
# → http://localhost:8765/healthz
```

#### Connect Claude Code (local dev)

Run once — no token needed:

```sh
claude mcp add --transport http context-layer http://localhost:8765/mcp
```

That's it. Verify with `claude mcp list` — you should see `✓ Connected`.

#### Connect Claude Desktop (local dev)

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) and restart the app:

```json
{
  "mcpServers": {
    "context-layer": {
      "type": "http",
      "url": "http://localhost:8765/mcp"
    }
  }
}
```

#### Connect to the production deployment

When `CONTEXT_LAYER_TOKEN` is set on the server (DigitalOcean encrypted env var), every request must include the bearer. Add it to the config:

```sh
claude mcp add --transport http context-layer \
  https://<your-do-app>.ondigitalocean.app/mcp-api/mcp \
  -H "Authorization: Bearer <CONTEXT_LAYER_TOKEN>"
```

Or in `~/.claude.json`:

```json
{
  "mcpServers": {
    "context-layer": {
      "type": "http",
      "url": "https://<your-do-app>.ondigitalocean.app/mcp-api/mcp",
      "headers": {
        "Authorization": "Bearer <CONTEXT_LAYER_TOKEN>"
      }
    }
  }
}
```

Docker-friendly snippet (Phase 20 wires this into the deployment):

```bash
docker run --rm -p 8765:8765 \
  -e CONTEXT_LAYER_TOKEN=demo \
  -e CONTEXT_LAYER_WORKSPACE=microservices-product-catalog \
  ghcr.io/your-org/context-layer-mcp:latest
```

Endpoints:
- `POST /mcp` and `GET /mcp` — the Streamable-HTTP transport (initialize + tool calls + SSE notifications all on one URL).
- `GET /healthz` — `{ ok: true, name, version, transport: "http" }`.
- Bearer auth: when `CONTEXT_LAYER_TOKEN` is set, every `/mcp` request must carry `Authorization: Bearer <token>`. When unset, the server accepts everything (local dev only).

### Programmatic (Node / Bun)

```ts
// stdio
import { createMcpServer } from "@context-layer/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
const server = createMcpServer();
await server.connect(new StdioServerTransport());

// HTTP
import { createHttpServer } from "@context-layer/mcp";
const httpServer = await createHttpServer({ token: process.env.CONTEXT_LAYER_TOKEN });
httpServer.listen(8765);
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

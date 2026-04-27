import { randomUUID } from "node:crypto";
import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMcpServer, type McpServerConfig } from "./server";

// Phase 18 — HTTP transport entrypoint.
//
// Boots the existing createMcpServer() factory onto an MCP Streamable HTTP
// transport (POST /mcp + GET /mcp for SSE notifications) plus a lightweight
// /healthz route for monitoring + DigitalOcean health checks.
//
// Stateful mode: the transport mints a session id on initialize so the SDK
// client's mandatory `notifications/initialized` POST is processed correctly.
// Single-replica deployment target — no horizontal scaling concerns yet.

export interface HttpServerConfig extends McpServerConfig {
  /** Bearer token required on every /mcp request. When undefined, auth is skipped (local dev). */
  token?: string;
  /** Server name (cosmetic; surfaces on /healthz). */
  name?: string;
  /** Server version string surfaced on /healthz. */
  version?: string;
}

/**
 * Build a Node `http.Server` ready for `listen(port)`.
 *
 * The server speaks MCP at `/mcp` (both POST and GET) and replies with a
 * small JSON status object at `/healthz`. CORS is permissive so a
 * browser-based MCP client can connect during local demos.
 *
 * Returns a Promise<Server> because the underlying mcp.connect(transport)
 * handshake is async — awaiting it before we start accepting requests
 * eliminates a race window on the first POST.
 */
export async function createHttpServer(config: HttpServerConfig = {}): Promise<Server> {
  const mcp = createMcpServer({ workspace: config.workspace, token: config.token });
  // Stateful mode: the transport mints a session id on initialize and the
  // SDK client honours it on subsequent requests. Stateless mode (sessionIdGenerator: undefined)
  // doesn't accommodate the client's mandatory `notifications/initialized` POST.
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
  });

  // Connect the server → transport once. The transport handles session
  // tracking internally; subsequent requests carry an `Mcp-Session-Id`
  // header that the transport uses to route to the right state.
  await mcp.connect(transport);

  const requireAuth = typeof config.token === "string" && config.token.length > 0;
  const expected = config.token ?? "";
  const version = config.version ?? "1.0.0";
  const name = config.name ?? "context-layer";

  return createServer((req, res) => {
    // CORS — permissive for the demo; `Mcp-Session-Id` exposed per the
    // Streamable HTTP spec so browser-based clients can read it.
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, Mcp-Session-Id");
    res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");
    if (req.method === "OPTIONS") {
      res.writeHead(204).end();
      return;
    }

    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

    if (url.pathname === "/healthz") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, name, version, transport: "http" }));
      return;
    }

    if (url.pathname === "/mcp") {
      if (requireAuth && !hasValidBearer(req, expected)) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "unauthorized",
            detail: "Missing or invalid Authorization: Bearer <token>",
          }),
        );
        return;
      }
      transport.handleRequest(req, res).catch((err: unknown) => {
        console.error("[mcp-http] transport error:", err);
        if (!res.headersSent) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "internal" }));
        }
      });
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "not found", path: url.pathname }));
  });
}

function hasValidBearer(req: IncomingMessage, expected: string): boolean {
  const header = req.headers.authorization ?? "";
  const match = /^Bearer (.+)$/.exec(header);
  if (!match) return false;
  return match[1].trim() === expected;
}

// Re-export for tests + package consumers that want to pass a custom Response signature.
export type { IncomingMessage, ServerResponse };

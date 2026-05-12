import { randomUUID } from "node:crypto";
import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMcpServer, type McpServerConfig } from "./server";

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
 * Each MCP session (identified by a fresh `initialize` POST without an
 * `Mcp-Session-Id` header) gets its own McpServer + transport pair so that
 * the protocol state machine resets cleanly between clients. Subsequent
 * requests in the same session carry the `Mcp-Session-Id` header and are
 * routed to the appropriate transport by the SDK.
 *
 * CORS is permissive for browser-based demo clients.
 * Returns a Promise<Server> because the structure needs to be async-ready.
 */
export function createHttpServer(config: HttpServerConfig = {}): Server {
  const requireAuth = typeof config.token === "string" && config.token.length > 0;
  const expected = config.token ?? "";
  const version = config.version ?? "1.0.0";
  const name = config.name ?? "context-layer";

  // Session registry: sessionId → live transport.
  const sessions = new Map<string, StreamableHTTPServerTransport>();

  return createServer((req, res) => {
    // CORS — permissive for demo; Mcp-Session-Id exposed per Streamable HTTP spec.
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
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
        res.end(JSON.stringify({ error: "unauthorized", detail: "Missing or invalid Authorization: Bearer <token>" }));
        return;
      }

      const sessionId = req.headers["mcp-session-id"] as string | undefined;

      // Route to an existing session.
      if (sessionId && sessions.has(sessionId)) {
        const transport = sessions.get(sessionId)!;
        transport.handleRequest(req, res).catch((err: unknown) => {
          console.error("[mcp-http] transport error:", err);
          if (!res.headersSent) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "internal" }));
          }
        });
        return;
      }

      // New initialize request — mint a fresh server + transport pair.
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => {
          const id = randomUUID();
          // Register the session so subsequent requests can find it.
          sessions.set(id, transport);
          return id;
        },
        onsessionclosed: (id: string) => {
          sessions.delete(id);
          console.error(`[mcp-http] session ${id} closed (${sessions.size} active)`);
        },
      });

      const mcp = createMcpServer({ workspace: config.workspace, token: config.token });
      mcp.connect(transport)
        .then(() =>
          transport.handleRequest(req, res).catch((err: unknown) => {
            console.error("[mcp-http] transport error:", err);
            if (!res.headersSent) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "internal" }));
            }
          }),
        )
        .catch((err: unknown) => {
          console.error("[mcp-http] connect error:", err);
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

// Re-export for tests + package consumers.
export type { IncomingMessage, ServerResponse };

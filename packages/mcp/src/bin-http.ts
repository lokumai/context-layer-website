#!/usr/bin/env bun
import { createHttpServer } from "./http";

// Phase 18 — HTTP entrypoint. Invoked by `bun run start:http` from the
// monorepo root or `npx -y @context-layer/mcp-http` once published.
//
// Env vars:
//   PORT                  — listen port (default 8765)
//   CONTEXT_LAYER_TOKEN   — bearer token; when set, /mcp requires
//                           `Authorization: Bearer <token>`. When unset,
//                           anonymous access is allowed (local dev only).
//   CONTEXT_LAYER_WORKSPACE — advisory workspace id, surfaced in logs.

const port = Number.parseInt(process.env.PORT ?? "8765", 10);
const token = process.env.CONTEXT_LAYER_TOKEN;
const workspace = process.env.CONTEXT_LAYER_WORKSPACE;

async function main() {
  const server = await createHttpServer({ workspace, token });

  server.listen(port, () => {
    const address = server.address();
    const actualPort = typeof address === "object" && address ? address.port : port;
    console.error(
      `[context-layer-mcp-http] listening on http://localhost:${actualPort}/mcp` +
        (token ? " (auth: bearer required)" : " (auth: open)") +
        (workspace ? ` (workspace: ${workspace})` : ""),
    );
  });

  let closing = false;
  function shutdown(signal: string) {
    if (closing) return;
    closing = true;
    console.error(`[context-layer-mcp-http] received ${signal}, closing…`);
    server.close((err) => {
      if (err) {
        console.error("[context-layer-mcp-http] close error:", err);
        process.exit(1);
      }
      process.exit(0);
    });
  }

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((err) => {
  console.error("[context-layer-mcp-http] fatal:", err);
  process.exit(1);
});

#!/usr/bin/env bun
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createMcpServer, resolveConfig } from "./server";

// Stdio entrypoint. Invoked by `npx -y @context-layer/mcp` from a Claude
// Desktop / Cursor MCP config. The caller owns the process; we keep it
// running until the transport closes.

async function main() {
  const config = resolveConfig();
  if (config.workspace) {
    // Log to stderr — stdout is reserved for the MCP JSON-RPC stream.
    console.error(`[context-layer-mcp] workspace=${config.workspace}`);
  }
  const server = createMcpServer(config);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("[context-layer-mcp] fatal:", err);
  process.exit(1);
});

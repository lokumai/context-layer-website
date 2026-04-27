// @context-layer/mcp — MCP server exposing a Context Layer workspace to
// external AI clients. This barrel keeps the public surface narrow: the
// factory function and the config type. Transport wiring is the caller's
// responsibility (stdio for Claude Desktop / Cursor, in-memory for tests,
// HTTP for future deployments).

export type { HttpServerConfig } from "./http";
export { createHttpServer } from "./http";
export type { McpServerConfig } from "./server";
export { createMcpServer, resolveConfig } from "./server";

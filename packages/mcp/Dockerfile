# syntax=docker/dockerfile:1.7
# Phase 20 — MCP Streamable-HTTP server image.
#
# Single-stage Bun image. The package is small (no transpile step required —
# Bun runs TypeScript directly), so we trade a few MB for a much simpler build.
# Bundles only the workspaces the MCP transitively depends on:
#   @context-layer/mocks, @context-layer/config

FROM oven/bun:1.2-alpine
WORKDIR /repo

# Install dependencies first for layer caching.
COPY package.json bun.lock turbo.json ./
COPY packages/config/package.json ./packages/config/package.json
COPY packages/mocks/package.json ./packages/mocks/package.json
COPY packages/mcp/package.json ./packages/mcp/package.json
RUN bun install --filter "@context-layer/mcp"

# Copy source — the loaders read from packages/mocks/data at runtime.
COPY packages/config ./packages/config
COPY packages/mocks ./packages/mocks
COPY packages/mcp ./packages/mcp

ENV PORT=8765
ENV NODE_ENV=production
EXPOSE 8765
CMD ["bun", "packages/mcp/src/bin-http.ts"]

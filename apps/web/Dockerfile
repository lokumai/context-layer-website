# syntax=docker/dockerfile:1.7
# Phase 20 — Next.js (standalone) image for the playground.
#
# Multi-stage Bun-based build:
#   1. deps  — install workspace dependencies once with bun install --frozen-lockfile
#   2. build — run `bun run build` for apps/web (Turbo handles transitive ^build)
#   3. runner — slim runtime stage that ships only .next/standalone + static + public + mocks data
#
# Resulting image runs `node apps/web/server.js` (the standalone entrypoint Next emits).
# Node 22 alpine in the runtime stage because Next standalone targets Node by default;
# the build stage uses Bun for fast monorepo install + Turbo dispatch.

FROM oven/bun:1.2-alpine AS deps
WORKDIR /repo
COPY package.json bun.lock turbo.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY packages/config/package.json ./packages/config/package.json
COPY packages/mocks/package.json ./packages/mocks/package.json
COPY packages/mcp/package.json ./packages/mcp/package.json
COPY packages/ui/package.json ./packages/ui/package.json
RUN bun install --frozen-lockfile

FROM oven/bun:1.2-alpine AS build
WORKDIR /repo
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/web/node_modules ./apps/web/node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun --cwd apps/web run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup -g 1001 -S nodejs && adduser -S -u 1001 nextjs
COPY --from=build --chown=nextjs:nodejs /repo/apps/web/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=build --chown=nextjs:nodejs /repo/apps/web/public ./apps/web/public
# Belt-and-braces: outputFileTracingIncludes already pulls in mocks data, but
# explicitly re-copy so a tracer regression can never produce a runtime FS miss.
COPY --from=build --chown=nextjs:nodejs /repo/packages/mocks/data ./packages/mocks/data
USER nextjs
EXPOSE 3000
CMD ["node", "apps/web/server.js"]

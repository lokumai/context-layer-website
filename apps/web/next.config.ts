import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@context-layer/ui"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Phase 20 — slim Docker images via Next.js standalone output.
  // The tracer doesn't follow non-JS files (markdown, JSON), so we explicitly
  // include the @context-layer/mocks data tree that the runtime loaders read
  // via fs.readFile (see packages/mocks/src/loaders/_fs.ts).
  output: "standalone",
  outputFileTracingRoot: process.cwd().replace(/\/apps\/web$/, ""),
  outputFileTracingIncludes: {
    "/api/mocks/**": ["../../packages/mocks/data/**"],
    "/workspace/**": ["../../packages/mocks/data/**"],
  },
};

export default nextConfig;

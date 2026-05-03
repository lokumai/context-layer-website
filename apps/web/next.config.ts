import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@context-layer/ui"],
  // Phase 20 — slim Docker images via Next.js standalone output.
  output: "standalone",
  outputFileTracingRoot: process.cwd().replace(/\/apps\/web$/, ""),
  outputFileTracingIncludes: {
    "/api/mocks/**": ["../../packages/mocks/data/**"],
    "/workspace/**": ["../../packages/mocks/data/**"],
  },
  reactCompiler: true,
  cacheComponents: true,
};

export default nextConfig;

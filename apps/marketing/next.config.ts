import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  transpilePackages: ["@context-layer/ui"],
  reactCompiler: true,
};

export default nextConfig;

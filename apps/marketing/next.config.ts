import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  transpilePackages: ["@context-layer/ui"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

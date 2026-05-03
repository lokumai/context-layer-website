import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  transpilePackages: ["@context-layer/ui"],
  reactCompiler: true,
  basePath: "/context-layer-website",
  trailingSlash: true,
};

export default nextConfig;

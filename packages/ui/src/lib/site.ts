// Empty on context.lokum.dev (served from the domain root); set NEXT_PUBLIC_BASE_PATH
// to "/context-layer-website" only for a github.io project-path build.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// The playground is not deployed, so the public screenshot tour stands in for it.
export const PLAYGROUND_URL =
  process.env.NEXT_PUBLIC_PLAYGROUND_URL ||
  "https://github.com/lokumai/context-layer-website/tree/main/assets/screenshots";

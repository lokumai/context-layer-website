import { describe, expect, it } from "vitest";

// Smoke test: confirms that @context-layer/mocks resolves through the
// turbo workspace graph and that the package's public barrel exposes
// the loaders Phase 4+ will bind to.

describe("@context-layer/mocks — cross-package import", () => {
  it("resolves the workspace + loader barrel from apps/web", async () => {
    const mocks = await import("@context-layer/mocks");
    expect(typeof mocks.getWorkspace).toBe("function");
    expect(typeof mocks.listSources).toBe("function");
    expect(typeof mocks.getWikiTree).toBe("function");
    expect(typeof mocks.listArtifacts).toBe("function");
    expect(typeof mocks.getCannedQA).toBe("function");
  });

  it("returns the expected workspace shape", async () => {
    const { getWorkspace, listSources } = await import("@context-layer/mocks");
    const ws = await getWorkspace();
    const sources = await listSources();
    expect(ws.slug).toBe("microservices-product-catalog");
    expect(sources).toHaveLength(14);
  });
});

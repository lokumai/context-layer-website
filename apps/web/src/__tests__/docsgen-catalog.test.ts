import { listArtifacts } from "@context-layer/mocks";
import { describe, expect, it } from "vitest";
import {
  DOCSGEN_BUNDLES,
  DOCSGEN_CATALOG,
  isValidBundleSlug,
} from "@/components/playground/generate/docsgen/catalog";

// The catalog is the UI's source of truth for what cards exist in each bundle.
// Every Phase 3 mock artifact must have a matching card in the catalog,
// otherwise the `full` persona would render an extra un-mapped "Done" card.

describe("DOCSGEN_CATALOG", () => {
  it("covers all 6 bundles", () => {
    expect(DOCSGEN_BUNDLES).toHaveLength(6);
    for (const slug of DOCSGEN_BUNDLES) {
      expect(DOCSGEN_CATALOG[slug]).toBeDefined();
      expect(DOCSGEN_CATALOG[slug].cards.length).toBeGreaterThan(0);
    }
  });

  it("isValidBundleSlug recognises valid slugs and rejects invalid ones", () => {
    expect(isValidBundleSlug("agentify")).toBe(true);
    expect(isValidBundleSlug("unknown-bundle")).toBe(false);
  });

  it("every Phase 3 mock artifact has a matching catalog card", async () => {
    const mocks = await listArtifacts();
    for (const m of mocks) {
      const card = DOCSGEN_CATALOG[m.bundle].cards.find((c) => c.cardSlug === m.cardSlug);
      expect(
        card,
        `missing catalog card for ${m.bundle}/${m.cardSlug} (mock id: ${m.id})`,
      ).toBeDefined();
    }
  });
});

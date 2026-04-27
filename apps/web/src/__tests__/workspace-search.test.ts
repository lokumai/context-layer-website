import { describe, expect, it } from "vitest";
import { filterWorkspaces } from "@/lib/workspaces/search";
import type { RuntimeWorkspace } from "@/stores/types";

function ws(overrides: Partial<RuntimeWorkspace>): RuntimeWorkspace {
  return {
    id: overrides.id ?? "w-1",
    name: overrides.name ?? "Workspace",
    slug: overrides.slug ?? "workspace",
    createdAt: overrides.createdAt ?? "2026-04-23T00:00:00.000Z",
    lastActivity: overrides.lastActivity ?? "2026-04-23T00:00:00.000Z",
    sourceCount: overrides.sourceCount ?? 0,
    syncStatus: overrides.syncStatus ?? "outdated",
    syncStrategy: overrides.syncStrategy ?? "per-pr-merge",
    description: overrides.description ?? "",
    hasWiki: overrides.hasWiki ?? false,
    graduated: overrides.graduated ?? false,
    hasIntelligence: overrides.hasIntelligence ?? false,
    intelligenceRefreshedAt: overrides.intelligenceRefreshedAt ?? null,
  };
}

describe("filterWorkspaces", () => {
  const pool = [
    ws({ id: "a", name: "microservices-product-catalog", description: "TMForum-compatible" }),
    ws({ id: "b", name: "Customer Portal", description: "Public-facing storefront" }),
    ws({ id: "c", name: "Analytics", description: "Internal Looker dashboards" }),
  ];

  it("returns everything when query is empty", () => {
    expect(filterWorkspaces(pool, "").map((w) => w.id)).toEqual(["a", "b", "c"]);
  });

  it("ignores leading/trailing whitespace", () => {
    expect(filterWorkspaces(pool, "   ").map((w) => w.id)).toEqual(["a", "b", "c"]);
  });

  it("matches case-insensitive substrings on name", () => {
    expect(filterWorkspaces(pool, "PORTAL").map((w) => w.id)).toEqual(["b"]);
  });

  it("matches case-insensitive substrings on description", () => {
    expect(filterWorkspaces(pool, "looker").map((w) => w.id)).toEqual(["c"]);
  });

  it("returns empty when nothing matches", () => {
    expect(filterWorkspaces(pool, "kubernetes")).toEqual([]);
  });

  it("does not throw when description is undefined", () => {
    const sparse = [ws({ id: "x", name: "Bare", description: undefined as unknown as string })];
    expect(filterWorkspaces(sparse, "bare").map((w) => w.id)).toEqual(["x"]);
  });
});

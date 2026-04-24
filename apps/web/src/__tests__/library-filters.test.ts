import type { Artifact } from "@context-layer/mocks";
import { describe, expect, it } from "vitest";
import {
  applyFilters,
  DEFAULT_FILTERS,
  type LibraryFilters,
} from "@/components/playground/library/filter-hook";

function make(overrides: Partial<Artifact>): Artifact {
  return {
    id: overrides.id ?? "a",
    bundle: overrides.bundle ?? "agentify",
    title: overrides.title ?? "Artifact",
    description: overrides.description ?? "desc",
    cardSlug: overrides.cardSlug ?? "slug",
    createdAt: overrides.createdAt ?? "2026-04-23T00:00:00.000Z",
    sizeBytes: overrides.sizeBytes ?? 1000,
    format: overrides.format ?? "markdown",
    status: overrides.status ?? "current",
    sourceRepos: overrides.sourceRepos ?? [],
    markdown: overrides.markdown ?? "# hi",
    tool: overrides.tool,
  };
}

const NOW = new Date("2026-04-23T12:00:00.000Z");

function withFilters(overrides: Partial<LibraryFilters>): LibraryFilters {
  return { ...DEFAULT_FILTERS, ...overrides };
}

describe("applyFilters", () => {
  it("returns everything when filters are default", () => {
    const pool = [make({ id: "a" }), make({ id: "b" })];
    expect(applyFilters(pool, DEFAULT_FILTERS, NOW)).toHaveLength(2);
  });

  it("filters by case-insensitive title substring", () => {
    const pool = [make({ id: "a", title: "CLAUDE.md" }), make({ id: "b", title: "Repo Map" })];
    const out = applyFilters(pool, withFilters({ query: "claude" }), NOW);
    expect(out.map((x) => x.id)).toEqual(["a"]);
  });

  it("matches against description too", () => {
    const pool = [
      make({ id: "a", title: "Foo", description: "about outbox pattern" }),
      make({ id: "b", title: "Bar", description: "pricing events" }),
    ];
    const out = applyFilters(pool, withFilters({ query: "outbox" }), NOW);
    expect(out.map((x) => x.id)).toEqual(["a"]);
  });

  it("filters by tool — artifacts with undefined tool count as docsgen", () => {
    const pool = [
      make({ id: "a", tool: "docsgen" }),
      make({ id: "b", tool: "omniboard" }),
      make({ id: "c" /* tool undefined */ }),
    ];
    const docs = applyFilters(pool, withFilters({ tool: "docsgen" }), NOW).map((x) => x.id);
    expect(docs.sort()).toEqual(["a", "c"]);

    const omni = applyFilters(pool, withFilters({ tool: "omniboard" }), NOW).map((x) => x.id);
    expect(omni).toEqual(["b"]);
  });

  it("filters by bundle", () => {
    const pool = [make({ id: "a", bundle: "agentify" }), make({ id: "b", bundle: "health-risk" })];
    expect(applyFilters(pool, withFilters({ bundle: "agentify" }), NOW).map((x) => x.id)).toEqual([
      "a",
    ]);
  });

  it("filters by format", () => {
    const pool = [make({ id: "a", format: "markdown" }), make({ id: "b", format: "slides" })];
    expect(applyFilters(pool, withFilters({ format: "slides" }), NOW).map((x) => x.id)).toEqual([
      "b",
    ]);
  });

  it("filters by status", () => {
    const pool = [make({ id: "a", status: "current" }), make({ id: "b", status: "failed" })];
    expect(applyFilters(pool, withFilters({ status: "failed" }), NOW).map((x) => x.id)).toEqual([
      "b",
    ]);
  });

  it("filters by created-within window (7d drops older)", () => {
    const pool = [
      make({ id: "fresh", createdAt: "2026-04-22T00:00:00.000Z" }),
      make({ id: "old", createdAt: "2026-03-01T00:00:00.000Z" }),
    ];
    const out = applyFilters(pool, withFilters({ window: "7d" }), NOW).map((x) => x.id);
    expect(out).toEqual(["fresh"]);
  });

  it("combines filters with AND", () => {
    const pool = [
      make({ id: "hit", bundle: "agentify", format: "markdown", title: "CLAUDE.md" }),
      make({ id: "other-bundle", bundle: "health-risk", format: "markdown", title: "CLAUDE.md" }),
      make({ id: "other-title", bundle: "agentify", format: "markdown", title: "AGENTS.md" }),
    ];
    const out = applyFilters(pool, withFilters({ bundle: "agentify", query: "claude" }), NOW).map(
      (x) => x.id,
    );
    expect(out).toEqual(["hit"]);
  });
});

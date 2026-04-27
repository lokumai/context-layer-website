import type { Job } from "@context-layer/mocks";
import { describe, expect, it } from "vitest";
import { synthesiseDiff } from "@/components/playground/wiki/logs/diff-renderer";

function makeJob(overrides: Partial<Job> = {}): Job {
  return {
    id: overrides.id ?? "job-001",
    type: overrides.type ?? "sync",
    trigger: overrides.trigger ?? "pr-merge",
    status: overrides.status ?? "success",
    startedAt: overrides.startedAt ?? "2026-04-22T13:41:00.000Z",
    completedAt: overrides.completedAt ?? "2026-04-22T13:42:12.000Z",
    durationMs: overrides.durationMs ?? 72000,
    repoIds: overrides.repoIds ?? ["offering-service"],
    summary: overrides.summary ?? "Synced after PR merge.",
    steps: overrides.steps ?? [],
    diffStats: overrides.diffStats ?? { added: 8, modified: 4, removed: 3 },
  };
}

describe("synthesiseDiff", () => {
  it("is deterministic — same input → same output", () => {
    const j = makeJob();
    expect(synthesiseDiff(j)).toBe(synthesiseDiff(j));
  });

  it("varies output across different jobs", () => {
    const a = synthesiseDiff(
      makeJob({ id: "job-a", diffStats: { added: 5, modified: 2, removed: 1 } }),
    );
    const b = synthesiseDiff(
      makeJob({ id: "job-b", diffStats: { added: 5, modified: 2, removed: 1 } }),
    );
    expect(a).not.toBe(b);
  });

  it("includes hunk headers referencing repoIds", () => {
    const out = synthesiseDiff(makeJob({ repoIds: ["pricing-service"] }));
    expect(out).toContain("services/pricing-service/");
    expect(out).toMatch(/@@.*L\d+ @@/);
  });

  it("emits +/- lines proportional to diffStats", () => {
    const out = synthesiseDiff(makeJob({ diffStats: { added: 10, modified: 0, removed: 0 } }));
    const adds = out.split("\n").filter((l) => l.startsWith("+"));
    const removes = out.split("\n").filter((l) => l.startsWith("-"));
    expect(adds.length).toBeGreaterThan(0);
    expect(removes.length).toBe(0);
  });

  it("respects the 50-line cap", () => {
    const out = synthesiseDiff(makeJob({ diffStats: { added: 200, modified: 200, removed: 200 } }));
    expect(out.split("\n").length).toBeLessThanOrEqual(50);
  });

  it("falls back to a default repo when repoIds is empty", () => {
    const out = synthesiseDiff(
      makeJob({ repoIds: [], diffStats: { added: 3, modified: 0, removed: 0 } }),
    );
    expect(out).toMatch(/services\/workspace\//);
  });
});

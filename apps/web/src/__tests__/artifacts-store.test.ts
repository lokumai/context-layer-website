import type { Artifact } from "@context-layer/mocks";
import { beforeEach, describe, expect, it } from "vitest";
import { useStore } from "@/stores";

const baseArtifact: Artifact = {
  id: "a-1",
  bundle: "agentify",
  title: "CLAUDE.md",
  description: "Claude guidelines",
  cardSlug: "claude-md",
  createdAt: "2026-04-23T10:00:00.000Z",
  sizeBytes: 5600,
  format: "markdown",
  status: "current",
  sourceRepos: ["foo"],
  markdown: "# CLAUDE.md",
  tool: "docsgen",
};

describe("artifacts slice", () => {
  beforeEach(() => {
    useStore.getState().reset();
  });

  it("addArtifact prepends and de-dupes by id (upsert)", () => {
    useStore.getState().addArtifact(baseArtifact);
    useStore.getState().addArtifact({ ...baseArtifact, title: "CLAUDE.md (updated)" });
    const s = useStore.getState();
    expect(s.artifacts).toHaveLength(1);
    expect(s.artifacts[0].title).toBe("CLAUDE.md (updated)");
  });

  it("replaceArtifact keeps position in the array", () => {
    useStore.getState().addArtifact({ ...baseArtifact, id: "b-1", title: "Later" });
    useStore.getState().addArtifact(baseArtifact); // added to front
    useStore.getState().replaceArtifact("a-1", { ...baseArtifact, title: "Regenerated" });
    const order = useStore.getState().artifacts.map((a) => [a.id, a.title]);
    expect(order).toEqual([
      ["a-1", "Regenerated"],
      ["b-1", "Later"],
    ]);
  });

  it("removeArtifact drops only the matching id", () => {
    useStore.getState().addArtifact({ ...baseArtifact, id: "b-1" });
    useStore.getState().addArtifact(baseArtifact);
    useStore.getState().removeArtifact("a-1");
    const ids = useStore.getState().artifacts.map((a) => a.id);
    expect(ids).toEqual(["b-1"]);
  });
});

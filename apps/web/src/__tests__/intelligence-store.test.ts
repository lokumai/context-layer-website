import { beforeEach, describe, expect, it } from "vitest";
import { useStore } from "@/stores";

describe("intelligence store + hasIntelligence flow", () => {
  beforeEach(() => {
    useStore.getState().reset();
  });

  it("createWorkspace starts with hasIntelligence=false and intelligenceRefreshedAt=null", () => {
    const id = useStore.getState().createWorkspace("WS");
    const w = useStore.getState().workspaces.find((x) => x.id === id);
    expect(w?.hasIntelligence).toBe(false);
    expect(w?.intelligenceRefreshedAt).toBeNull();
  });

  it("setHasIntelligence(true) stamps refreshed timestamp", () => {
    const id = useStore.getState().createWorkspace("WS");
    useStore.getState().setHasIntelligence(id, true);
    const w = useStore.getState().workspaces.find((x) => x.id === id);
    expect(w?.hasIntelligence).toBe(true);
    expect(w?.intelligenceRefreshedAt).not.toBeNull();
  });

  it("setHasIntelligence(false) clears the timestamp", () => {
    const id = useStore.getState().createWorkspace("WS");
    useStore.getState().setHasIntelligence(id, true);
    useStore.getState().setHasIntelligence(id, false);
    const w = useStore.getState().workspaces.find((x) => x.id === id);
    expect(w?.hasIntelligence).toBe(false);
    expect(w?.intelligenceRefreshedAt).toBeNull();
  });

  it("setIntelligenceData populates all 5 slice fields", () => {
    useStore.getState().setIntelligenceData({
      health: {
        overallScore: 84,
        summary: "ok",
        perRepo: [],
      },
      security: {
        summary: { critical: 0, high: 2, medium: 6, low: 11, info: 8 },
        findings: [],
      },
      coverage: { overall: 81.4, perRepo: [] },
      dependencies: {
        summary: "",
        crossRepoCount: 9,
        outdatedCount: 13,
        nodes: [],
      },
      knowledgeGraph: { nodes: [], edges: [] },
    });
    const s = useStore.getState();
    expect(s.health?.overallScore).toBe(84);
    expect(s.security?.summary.high).toBe(2);
    expect(s.coverage?.overall).toBe(81.4);
    expect(s.dependencies?.outdatedCount).toBe(13);
    expect(s.knowledgeGraph).toBeDefined();
  });
});

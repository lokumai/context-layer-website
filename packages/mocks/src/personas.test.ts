import { describe, it, expect } from "vitest";
import { seedForPersona } from "./personas";

describe("seedForPersona", () => {
  it("full: returns the canonical workspace with all data", () => {
    const state = seedForPersona("full");
    expect(state.persona).toBe("full");
    expect(state.workspaces).toHaveLength(1);
    const ws = state.workspaces[0];
    expect(ws.workspace.stage).toBe("graduated");
    expect(ws.sources.length).toBeGreaterThanOrEqual(9);
    expect(ws.wikiSummary).not.toBeNull();
    expect(ws.intelligenceDashboards.length).toBeGreaterThan(0);
    expect(ws.libraryItems.length).toBeGreaterThan(0);
    expect(ws.chatThreads.length).toBeGreaterThan(0);
  });

  it("partial: has sources + wiki but no library / no threads / cards idle", () => {
    const state = seedForPersona("partial");
    expect(state.persona).toBe("partial");
    expect(state.workspaces).toHaveLength(1);
    const ws = state.workspaces[0];
    expect(ws.workspace.stage).toBe("wiki-ready");
    expect(ws.sources.length).toBeGreaterThanOrEqual(9);
    expect(ws.wikiSummary).not.toBeNull();
    expect(ws.intelligenceSummary.freshness).toBe("never");
    expect(ws.intelligenceDashboards).toHaveLength(0);
    expect(ws.libraryItems).toHaveLength(0);
    expect(ws.chatThreads).toHaveLength(0);
    expect(ws.docsGenCards.every((c) => c.state === "idle")).toBe(true);
    expect(ws.omniBoardArtifacts).toHaveLength(0);
  });

  it("empty: has zero workspaces", () => {
    const state = seedForPersona("empty");
    expect(state.persona).toBe("empty");
    expect(state.workspaces).toHaveLength(0);
  });
});

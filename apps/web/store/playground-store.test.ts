// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { usePlaygroundStore } from "./playground-store";

describe("usePlaygroundStore", () => {
  beforeEach(() => {
    usePlaygroundStore.getState().__resetAll();
    localStorage.clear();
  });

  it("hydrates from 'full' persona seed", () => {
    usePlaygroundStore.getState().hydrateFromPersona("full");
    const s = usePlaygroundStore.getState();
    expect(s.persona).toBe("full");
    expect(s.workspaces).toHaveLength(1);
    expect(s.workspaces[0].sources.length).toBeGreaterThanOrEqual(9);
    expect(s.workspaces[0].libraryItems.length).toBeGreaterThan(0);
  });

  it("hydrates from 'empty' persona seed with zero workspaces", () => {
    usePlaygroundStore.getState().hydrateFromPersona("empty");
    const s = usePlaygroundStore.getState();
    expect(s.persona).toBe("empty");
    expect(s.workspaces).toHaveLength(0);
  });

  it("createWorkspace adds to empty persona", () => {
    usePlaygroundStore.getState().hydrateFromPersona("empty");
    usePlaygroundStore.getState().createWorkspace("my-workspace");
    expect(usePlaygroundStore.getState().workspaces).toHaveLength(1);
    expect(usePlaygroundStore.getState().workspaces[0].workspace.name).toBe("my-workspace");
    expect(usePlaygroundStore.getState().workspaces[0].workspace.stage).toBe("empty");
  });

  it("addQuickPopulateSources adds the 9 microservice repos", () => {
    usePlaygroundStore.getState().hydrateFromPersona("empty");
    const wsId = usePlaygroundStore.getState().createWorkspace("demo");
    usePlaygroundStore.getState().addQuickPopulateSources(wsId);
    const ws = usePlaygroundStore.getState().workspaces.find((w) => w.workspace.id === wsId)!;
    expect(ws.sources.length).toBeGreaterThanOrEqual(9);
    expect(ws.workspace.stage).toBe("sources-only");
  });

  it("resetActiveWorkspace rehydrates from persona seed", () => {
    usePlaygroundStore.getState().hydrateFromPersona("full");
    const wsId = "microservices-product-catalog";
    usePlaygroundStore.getState().setActiveWorkspace(wsId);
    usePlaygroundStore.setState((s) => ({
      ...s,
      workspaces: s.workspaces.map((w) =>
        w.workspace.id === wsId ? { ...w, libraryItems: [] } : w
      ),
    }));
    expect(usePlaygroundStore.getState().workspaces[0].libraryItems).toHaveLength(0);
    usePlaygroundStore.getState().resetActiveWorkspace();
    expect(usePlaygroundStore.getState().workspaces[0].libraryItems.length).toBeGreaterThan(0);
  });
});

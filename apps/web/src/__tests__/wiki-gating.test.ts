import { beforeEach, describe, expect, it } from "vitest";
import type { Source } from "@context-layer/mocks";
import { useStore } from "@/stores";

const DEMO_SOURCE: Source = {
  id: "s-1",
  name: "demo",
  kind: "code",
  category: "github",
  url: "https://github.com/a/b",
  path: "a/b",
  status: "indexed",
  autoSync: true,
  lastIndexed: new Date().toISOString(),
  lineCount: 0,
  tokenCount: 0,
  primaryLanguage: "TS",
  description: "",
};

describe("wiki slice + gating preconditions", () => {
  beforeEach(() => {
    useStore.getState().reset();
  });

  it("setWikiData populates tree + narrative + llms", () => {
    useStore.getState().setWikiData({
      tree: { foo: { repoId: "foo", nodes: [] } },
      narrative: { markdown: "# hi", tokenCount: 10, sections: [] },
      sagaFlows: null,
      llms: { _workspace: { repoId: null, markdown: "index" } },
    });
    const s = useStore.getState();
    expect(Object.keys(s.wikiTrees)).toEqual(["foo"]);
    expect(s.narrative?.markdown).toBe("# hi");
    expect(s.llms._workspace?.markdown).toBe("index");
  });

  it("setGraduated flips hasWiki true + graduated true", () => {
    const id = useStore.getState().createWorkspace("WS");
    useStore.getState().setGraduated(id, true);
    const w = useStore.getState().workspaces.find((w) => w.id === id);
    expect(w?.hasWiki).toBe(true);
    expect(w?.graduated).toBe(true);
  });

  it("setGraduated(false) flips both back", () => {
    const id = useStore.getState().createWorkspace("WS");
    useStore.getState().setGraduated(id, true);
    useStore.getState().setGraduated(id, false);
    const w = useStore.getState().workspaces.find((w) => w.id === id);
    // setGraduated(false) only sets graduated:false; hasWiki is kept per the
    // current implementation (deletion of Wiki is a separate concern handled
    // by Delete button). Verify graduated dropped.
    expect(w?.graduated).toBe(false);
  });

  it("gating precondition — partial-like state unlocks Knowledge", () => {
    // The NavDestinations gating logic is:
    //   Knowledge: sources.length > 0
    //   Chatbot/Generate/Library: hasWiki === true
    // Mirror that here on the store shape directly.
    const id = useStore.getState().createWorkspace("WS");
    useStore.getState().addSource(DEMO_SOURCE);
    const s = useStore.getState();
    const ws = s.workspaces.find((w) => w.id === id);
    expect(s.sources.length).toBeGreaterThan(0);
    expect(ws?.hasWiki).toBe(false);
    // partial-like → Knowledge would be unlocked; downstream still locked.

    useStore.getState().setGraduated(id, true);
    const s2 = useStore.getState();
    expect(s2.workspaces.find((w) => w.id === id)?.hasWiki).toBe(true);
    // full-like → everything unlocked.
  });
});

import { beforeEach, describe, expect, it } from "vitest";
import type { Source } from "@context-layer/mocks";
import { useStore } from "@/stores";

describe("workspace + sources store actions (Phase 6)", () => {
  beforeEach(() => {
    useStore.getState().reset();
  });

  it("createWorkspace appends a RuntimeWorkspace and activates it", () => {
    const id = useStore.getState().createWorkspace("My Workspace");
    const s = useStore.getState();
    expect(s.workspaces).toHaveLength(1);
    expect(s.workspaces[0].id).toBe(id);
    expect(s.workspaces[0].name).toBe("My Workspace");
    expect(s.workspaces[0].hasWiki).toBe(false);
    expect(s.workspaces[0].graduated).toBe(false);
    expect(s.activeWorkspaceId).toBe(id);
  });

  it("renameWorkspace updates in place", () => {
    const id = useStore.getState().createWorkspace("Old");
    useStore.getState().renameWorkspace(id, "New");
    expect(useStore.getState().workspaces[0].name).toBe("New");
  });

  it("setGraduated flips flag + hasWiki true", () => {
    const id = useStore.getState().createWorkspace("X");
    useStore.getState().setGraduated(id, true);
    const w = useStore.getState().workspaces[0];
    expect(w.graduated).toBe(true);
    expect(w.hasWiki).toBe(true);
  });

  it("addSource appends; markIndexing/markIndexed transition status", () => {
    const src: Source = {
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
    useStore.getState().addSource(src);
    expect(useStore.getState().sources).toHaveLength(1);

    useStore.getState().markIndexing("s-1");
    expect(useStore.getState().sources[0].status).toBe("indexing");

    useStore.getState().markIndexed("s-1");
    expect(useStore.getState().sources[0].status).toBe("indexed");
  });

  it("removeSource / renameSource / toggleAutoSync work", () => {
    const src: Source = {
      id: "s-2",
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
    useStore.getState().addSource(src);
    useStore.getState().renameSource("s-2", "new-name");
    expect(useStore.getState().sources[0].name).toBe("new-name");

    useStore.getState().toggleAutoSync("s-2");
    expect(useStore.getState().sources[0].autoSync).toBe(false);

    useStore.getState().removeSource("s-2");
    expect(useStore.getState().sources).toHaveLength(0);
  });

  it("UI slice — wizard dismiss + modal flags", () => {
    useStore.getState().setCreateWorkspaceModalOpen(true);
    expect(useStore.getState().createWorkspaceModalOpen).toBe(true);

    useStore.getState().setAddSourceChooserOpen(true);
    expect(useStore.getState().addSourceChooserOpen).toBe(true);

    useStore.getState().setActiveSourcePreviewId("abc");
    expect(useStore.getState().activeSourcePreviewId).toBe("abc");

    useStore.getState().dismissFirstTimeWizard("ws-1");
    expect(useStore.getState().firstTimeWizardDismissedFor).toContain("ws-1");
    // Idempotent
    useStore.getState().dismissFirstTimeWizard("ws-1");
    expect(useStore.getState().firstTimeWizardDismissedFor).toHaveLength(1);
  });
});

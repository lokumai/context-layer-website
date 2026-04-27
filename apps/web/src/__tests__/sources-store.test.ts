import type { Source } from "@context-layer/mocks";
import { beforeEach, describe, expect, it } from "vitest";
import { useStore } from "@/stores";

const baseSource: Source = {
  id: "s-1",
  name: "API Gateway",
  kind: "code",
  category: "github",
  url: "https://github.com/x/y",
  path: "services/api-gateway",
  status: "indexing",
  autoSync: true,
  lastIndexed: "2026-04-23T00:00:00.000Z",
  lineCount: 0,
  tokenCount: 0,
  primaryLanguage: "Python",
  description: "",
  knowledgeSync: "outdated",
};

describe("sources slice — Phase 14 knowledgeSync axis", () => {
  beforeEach(() => {
    useStore.getState().reset();
  });

  it("addSource preserves caller-provided knowledgeSync", () => {
    useStore.getState().addSource(baseSource);
    const stored = useStore.getState().sources.find((x) => x.id === "s-1");
    expect(stored?.knowledgeSync).toBe("outdated");
  });

  it("markSynced flips an outdated source to synced", () => {
    useStore.getState().addSource(baseSource);
    useStore.getState().markSynced("s-1");
    expect(useStore.getState().sources[0].knowledgeSync).toBe("synced");
  });

  it("markOutdated flips a synced source back to outdated", () => {
    useStore.getState().addSource({ ...baseSource, knowledgeSync: "synced" });
    useStore.getState().markOutdated("s-1");
    expect(useStore.getState().sources[0].knowledgeSync).toBe("outdated");
  });

  it("markSynced is a no-op for unknown ids", () => {
    useStore.getState().addSource(baseSource);
    useStore.getState().markSynced("nope");
    expect(useStore.getState().sources[0].knowledgeSync).toBe("outdated");
  });

  it("markIndexed flips status without touching knowledgeSync", () => {
    useStore.getState().addSource(baseSource);
    useStore.getState().markIndexed("s-1");
    const s = useStore.getState().sources[0];
    expect(s.status).toBe("indexed");
    // Phase 14: indexing pipeline is orthogonal — knowledgeSync stays "outdated"
    // until Wiki Configure's Force Sync flips it.
    expect(s.knowledgeSync).toBe("outdated");
  });
});

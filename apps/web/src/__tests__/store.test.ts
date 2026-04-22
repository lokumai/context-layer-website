import { describe, expect, it } from "vitest";
import { bootstrapPayload } from "@/lib/hydration/bootstrap";
import { persistKey } from "@/stores/persist-config";
import { useStore } from "@/stores";

describe("Zustand store hydration", () => {
  it("starts empty before hydration", () => {
    useStore.getState().reset();
    const s = useStore.getState();
    expect(s.workspaces).toHaveLength(0);
    expect(s.isHydrated).toBe(false);
    expect(s.personaId).toBeNull();
  });

  it("hydrate(full) populates every slice", async () => {
    const payload = await bootstrapPayload("full");
    useStore.getState().hydrate(payload, "full");
    const s = useStore.getState();
    expect(s.personaId).toBe("full");
    expect(s.isHydrated).toBe(true);
    expect(s.workspaces).toHaveLength(1);
    expect(s.sources).toHaveLength(9);
    expect(s.narrative).not.toBeNull();
    expect(s.health).not.toBeNull();
    expect(s.artifacts.length).toBeGreaterThan(0);
    expect(s.cannedQA.length).toBeGreaterThan(0);
    expect(s.jobs.length).toBeGreaterThan(0);
  });

  it("hydrate(empty) clears slices", async () => {
    const payload = await bootstrapPayload("empty");
    useStore.getState().hydrate(payload, "empty");
    const s = useStore.getState();
    expect(s.personaId).toBe("empty");
    expect(s.workspaces).toHaveLength(0);
    expect(s.sources).toHaveLength(0);
    expect(s.narrative).toBeNull();
    expect(s.artifacts).toHaveLength(0);
  });

  it("hydrate(partial) has sources but no wiki / intelligence / chatbot", async () => {
    const payload = await bootstrapPayload("partial");
    useStore.getState().hydrate(payload, "partial");
    const s = useStore.getState();
    expect(s.personaId).toBe("partial");
    expect(s.sources).toHaveLength(9);
    expect(s.narrative).toBeNull();
    expect(s.health).toBeNull();
    expect(s.cannedQA).toHaveLength(0);
    expect(s.artifacts).toHaveLength(0);
  });

  it("persistKey is persona-scoped", () => {
    expect(persistKey("empty")).toBe("context-layer:empty");
    expect(persistKey("partial")).toBe("context-layer:partial");
    expect(persistKey("full")).toBe("context-layer:full");
    expect(persistKey(null)).toBe("context-layer:anon");
  });

  it("ui slice state is not present on the persisted projection", async () => {
    // The persist middleware's partialize excludes `navOpen` + the action
    // functions; we assert by reading the config's partialize through a fresh
    // import of persist-config.
    const { persistConfig } = await import("@/stores/persist-config");
    const full = useStore.getState();
    const projected = persistConfig().partialize?.(full) as Record<string, unknown>;
    expect(projected).not.toHaveProperty("navOpen");
    expect(projected).not.toHaveProperty("setNavOpen");
    expect(projected).toHaveProperty("workspaces");
    expect(projected).toHaveProperty("personaId");
  });
});

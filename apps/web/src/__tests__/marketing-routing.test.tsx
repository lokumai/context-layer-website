import { describe, expect, it } from "vitest";

// Smoke: each marketing page module imports cleanly and exports a default
// React component. Bumps confidence that the routes resolve and the route
// group wires up without runtime errors.

describe("marketing page modules", () => {
  it("home loads", async () => {
    const m = await import("@/app/(marketing)/page");
    expect(typeof m.default).toBe("function");
  });
  it("context-layer loads", async () => {
    const m = await import("@/app/(marketing)/product/context-layer/page");
    expect(typeof m.default).toBe("function");
  });
  it("code-translation loads", async () => {
    const m = await import("@/app/(marketing)/product/code-translation/page");
    expect(typeof m.default).toBe("function");
  });
  it("code-modernization loads", async () => {
    const m = await import("@/app/(marketing)/product/code-modernization/page");
    expect(typeof m.default).toBe("function");
  });
  it("design-system (internal) loads", async () => {
    const m = await import("@/app/(marketing)/design-system/page");
    expect(typeof m.default).toBe("function");
  });
});

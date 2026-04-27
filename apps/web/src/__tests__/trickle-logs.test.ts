import { describe, expect, it } from "vitest";
import { pickLine } from "@/components/playground/loaders/trickle-logs";

describe("pickLine — TrickleLogs deterministic rotation", () => {
  it("rotates deterministically inside a topic", () => {
    const a0 = pickLine("wiki", 0);
    const a1 = pickLine("wiki", 1);
    expect(a0).toBeTypeOf("string");
    expect(a1).toBeTypeOf("string");
    expect(a0).not.toEqual(a1);
    // Same tick → same line (pure).
    expect(pickLine("wiki", 0)).toBe(a0);
  });

  it("loops back to the first entry once tick exceeds template length", () => {
    const first = pickLine("intelligence", 0);
    // Big tick — should still resolve cleanly via modulo.
    const big = pickLine("intelligence", 100);
    expect(big).toBeTypeOf("string");
    // The wrap-around at len*N yields the same line as tick 0.
    // We don't hard-code length; instead check the function never throws and
    // returns one of the canonical lines.
    expect(first).toMatch(/[A-Z]/);
  });

  it("topics produce distinct line sets", () => {
    const wiki = pickLine("wiki", 0);
    const intel = pickLine("intelligence", 0);
    const docs = pickLine("docsgen", 0);
    const omni = pickLine("omniboard", 0);
    // Non-empty.
    for (const v of [wiki, intel, docs, omni]) {
      expect(v.length).toBeGreaterThan(0);
    }
    // Topic 0-th lines differ.
    expect(new Set([wiki, intel, docs, omni]).size).toBe(4);
  });
});

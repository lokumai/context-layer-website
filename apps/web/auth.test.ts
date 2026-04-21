import { describe, it, expect } from "vitest";
import { authorizePersona } from "./auth.utils";

describe("authorizePersona", () => {
  it("accepts 'full'", () => {
    const user = authorizePersona({ username: "full" });
    expect(user).toMatchObject({ id: "full", persona: "full" });
  });
  it("accepts 'partial'", () => {
    const user = authorizePersona({ username: "partial" });
    expect(user).toMatchObject({ id: "partial", persona: "partial" });
  });
  it("accepts 'empty'", () => {
    const user = authorizePersona({ username: "empty" });
    expect(user).toMatchObject({ id: "empty", persona: "empty" });
  });
  it("rejects anything else", () => {
    expect(authorizePersona({ username: "other" })).toBeNull();
  });
});

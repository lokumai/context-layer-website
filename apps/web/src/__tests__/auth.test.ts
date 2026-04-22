import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { verifyCredentials } from "@/lib/personas";

// Auth.js's Credentials provider uses authorize() — we exercise our core
// decision function (verifyCredentials) here rather than booting NextAuth,
// which is painful to isolate from Next.js request context.

const ORIG_ENV = { ...process.env };

describe("credentials authorization (verifyCredentials)", () => {
  beforeEach(() => {
    process.env = { ...ORIG_ENV };
    process.env.AUTH_EMPTY_PASSWORD = "empty-pw";
    process.env.AUTH_PARTIAL_PASSWORD = "partial-pw";
    process.env.AUTH_FULL_PASSWORD = "full-pw";
  });
  afterEach(() => {
    process.env = { ...ORIG_ENV };
  });

  it("accepts valid credentials for each persona", () => {
    expect(verifyCredentials("empty", "empty-pw")).toBe("empty");
    expect(verifyCredentials("partial", "partial-pw")).toBe("partial");
    expect(verifyCredentials("full", "full-pw")).toBe("full");
  });

  it("rejects wrong password", () => {
    expect(verifyCredentials("empty", "partial-pw")).toBeNull();
  });

  it("rejects unknown username without leaking which field was wrong", () => {
    // Same null return for both failure modes — the caller cannot distinguish
    // "bad username" from "bad password" from the return value.
    const unknownUser = verifyCredentials("admin", "full-pw");
    const badPassword = verifyCredentials("full", "wrong");
    expect(unknownUser).toBeNull();
    expect(badPassword).toBeNull();
    expect(unknownUser).toEqual(badPassword);
  });

  it("rejects empty inputs", () => {
    expect(verifyCredentials("", "")).toBeNull();
    expect(verifyCredentials("full", "")).toBeNull();
    expect(verifyCredentials("", "full-pw")).toBeNull();
  });
});

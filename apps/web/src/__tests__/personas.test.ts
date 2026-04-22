import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  PERSONA_IDS,
  isPersonaId,
  personaEnvVar,
  passwordForPersona,
  safeEqual,
  verifyCredentials,
} from "@/lib/personas";

const ORIG_ENV = { ...process.env };

describe("personas", () => {
  beforeEach(() => {
    process.env = { ...ORIG_ENV };
  });
  afterEach(() => {
    vi.restoreAllMocks();
    process.env = { ...ORIG_ENV };
  });

  it("exposes the three persona ids", () => {
    expect([...PERSONA_IDS]).toEqual(["empty", "partial", "full"]);
  });

  it("isPersonaId guards strings", () => {
    expect(isPersonaId("empty")).toBe(true);
    expect(isPersonaId("admin")).toBe(false);
    expect(isPersonaId(null)).toBe(false);
  });

  it("maps persona id to env var name", () => {
    expect(personaEnvVar("empty")).toBe("AUTH_EMPTY_PASSWORD");
    expect(personaEnvVar("partial")).toBe("AUTH_PARTIAL_PASSWORD");
    expect(personaEnvVar("full")).toBe("AUTH_FULL_PASSWORD");
  });

  it("passwordForPersona returns env var when set", () => {
    process.env.AUTH_FULL_PASSWORD = "prod-secret";
    expect(passwordForPersona("full")).toBe("prod-secret");
  });

  it("passwordForPersona falls back in dev and warns once", () => {
    (process.env as Record<string, string>).NODE_ENV = "development";
    delete process.env.AUTH_PARTIAL_PASSWORD;
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(passwordForPersona("partial")).toBe("changeme-partial");
    expect(passwordForPersona("partial")).toBe("changeme-partial");
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("passwordForPersona hard-fails in production", () => {
    (process.env as Record<string, string>).NODE_ENV = "production";
    delete process.env.AUTH_EMPTY_PASSWORD;
    expect(() => passwordForPersona("empty")).toThrow(/AUTH_EMPTY_PASSWORD/);
  });

  it("safeEqual returns true for identical strings, false otherwise", () => {
    expect(safeEqual("abc", "abc")).toBe(true);
    expect(safeEqual("abc", "abd")).toBe(false);
    expect(safeEqual("abc", "abcd")).toBe(false);
  });

  it("verifyCredentials returns the persona id on match", () => {
    process.env.AUTH_EMPTY_PASSWORD = "letmein";
    expect(verifyCredentials("empty", "letmein")).toBe("empty");
    expect(verifyCredentials("empty", "wrong")).toBeNull();
    expect(verifyCredentials("not-a-persona", "letmein")).toBeNull();
  });
});

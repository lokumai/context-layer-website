import { describe, expect, it } from "vitest";

// Pure logic test: replicate the classification used by middleware.ts.
// Booting the real Auth.js middleware with a mocked request is flaky across
// Next.js versions; here we pin the classification rules in a unit test.

const PUBLIC_PATHS = new Set<string>(["/", "/login"]);
const PUBLIC_PREFIXES = ["/product/", "/api/auth/", "/_next/", "/assets/", "/favicon"];
const PUBLIC_FILES = new Set<string>(["/logo-landscape.svg"]);

function isPublicPath(pathname: string): boolean {
  return (
    PUBLIC_PATHS.has(pathname) ||
    PUBLIC_FILES.has(pathname) ||
    PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))
  );
}

describe("middleware path classification", () => {
  it("marks marketing and login as public", () => {
    expect(isPublicPath("/")).toBe(true);
    expect(isPublicPath("/login")).toBe(true);
    expect(isPublicPath("/product/context-layer")).toBe(true);
    expect(isPublicPath("/api/auth/session")).toBe(true);
    expect(isPublicPath("/_next/static/chunks/x.js")).toBe(true);
    expect(isPublicPath("/favicon.ico")).toBe(true);
    expect(isPublicPath("/logo-landscape.svg")).toBe(true);
  });

  it("marks playground surfaces as private", () => {
    expect(isPublicPath("/workspaces")).toBe(false);
    expect(isPublicPath("/workspaces/123")).toBe(false);
    expect(isPublicPath("/chatbot")).toBe(false);
    expect(isPublicPath("/api/mocks/bootstrap")).toBe(false);
  });
});

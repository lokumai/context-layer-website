import { expect, test } from "@playwright/test";

// End-to-end auth smoke: each persona signs in, lands on the marketing root,
// and Zustand persists a persona-scoped bucket in localStorage.
//
// Assumes dev-fallback passwords (changeme-empty / changeme-partial /
// changeme-full) — the default when AUTH_*_PASSWORD env vars are unset,
// which is the case under `bun run dev` in the repo.

const PERSONAS = [
  { id: "empty", password: "changeme-empty", expectedSources: 0 },
  { id: "partial", password: "changeme-partial", expectedSources: 9 },
  { id: "full", password: "changeme-full", expectedSources: 9 },
] as const;

test.describe("auth + hydration", () => {
  test("unauthenticated playground request redirects to /login", async ({ page }) => {
    await page.goto("/workspaces");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
  });

  for (const persona of PERSONAS) {
    test(`signs in as ${persona.id} and hydrates store`, async ({ page }) => {
      await page.goto("/login");
      await page.getByLabel(/persona/i).fill(persona.id);
      await page.getByLabel(/password/i).fill(persona.password);

      // Wait for the bootstrap fetch that fires after hydration.
      const bootstrapPromise = page.waitForResponse(
        (res) => res.url().includes("/api/mocks/bootstrap") && res.status() === 200,
      );

      await page.getByRole("button", { name: /sign in/i }).click();
      const bootstrap = await bootstrapPromise;
      const body = (await bootstrap.json()) as {
        personaId: string;
        payload: { sources: unknown[] };
      };
      expect(body.personaId).toBe(persona.id);
      expect(body.payload.sources.length).toBe(persona.expectedSources);

      // Persona-scoped localStorage bucket eventually populates.
      await expect
        .poll(
          async () =>
            (await page.evaluate((key) => window.localStorage.getItem(key), `context-layer:${persona.id}`)) !==
            null,
        )
        .toBe(true);
    });
  }
});

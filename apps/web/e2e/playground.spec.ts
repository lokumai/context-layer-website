import { expect, test } from "@playwright/test";

const PERSONAS = [
  {
    id: "empty",
    password: "e2e-empty",
    expectedWorkspaces: 0,
    expectedSources: 0,
  },
  {
    id: "partial",
    password: "e2e-partial",
    expectedWorkspaces: 1,
    expectedSources: 9,
    expectWizard: true,
    expectLockedKnowledge: true,
  },
  {
    id: "full",
    password: "e2e-full",
    expectedWorkspaces: 1,
    expectedSources: 9,
    expectWizard: false,
    expectLockedKnowledge: false,
  },
] as const;

async function signInAs(page: import("@playwright/test").Page, persona: string, password: string) {
  await page.goto("/login");
  await page.getByLabel(/persona/i).fill(persona);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL(/\/workspaces/, { timeout: 60_000 });
}

test.describe("playground per-persona", () => {
  for (const p of PERSONAS) {
    test(`${p.id}: lands on /workspaces with expected state`, async ({ page }) => {
      test.setTimeout(90_000);
      await signInAs(page, p.id, p.password);

      // Empty persona → empty state; partial/full → 1 workspace card visible.
      if (p.expectedWorkspaces === 0) {
        await expect(page.getByRole("heading", { name: /create your first workspace/i })).toBeVisible();
      } else {
        await expect(page.getByTestId("workspace-card").first()).toBeVisible();
      }
    });

    test(`${p.id}: entering a workspace hits Sources`, async ({ page }) => {
      test.setTimeout(90_000);
      await signInAs(page, p.id, p.password);

      if (p.expectedWorkspaces === 0) {
        // empty persona has no workspace to enter; create flow is covered elsewhere
        return;
      }

      await page.getByTestId("workspace-card").first().click();
      await page.waitForURL(/\/workspace\/[^/]+\/sources/, { timeout: 60_000 });
      await expect(page.getByRole("heading", { name: /^sources$/i })).toBeVisible();
      const sourceCards = page.getByTestId("source-card");
      await expect(sourceCards.first()).toBeVisible();

      if ((p as { expectWizard?: boolean }).expectWizard) {
        await expect(page.getByTestId("first-time-wizard")).toBeVisible();
      } else {
        await expect(page.getByTestId("first-time-wizard")).toHaveCount(0);
      }

      // Progressive gating: Knowledge locked for partial, unlocked for full.
      const knowledge = page.getByTestId("nav-knowledge");
      await expect(knowledge).toBeVisible();
      if ((p as { expectLockedKnowledge?: boolean }).expectLockedKnowledge) {
        await expect(knowledge).toHaveAttribute("data-locked", "true");
      }
    });
  }
});

import { expect, test } from "@playwright/test";

async function signIn(
  page: import("@playwright/test").Page,
  persona: string,
  password: string,
) {
  await page.goto("/login");
  await page.getByLabel(/persona/i).fill(persona);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL(/\/workspaces/, { timeout: 60_000 });
}

test.describe("wiki per-persona", () => {
  test("partial: Wiki tabs show locked empty state; Configure opens", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await signIn(page, "partial", "e2e-partial");

    // Enter the workspace
    await page.getByTestId("workspace-card").first().click();
    await page.waitForURL(/\/workspace\/[^/]+\/sources/);

    // Knowledge should now be unlocked (sources > 0). Visit Wiki Status.
    await page.getByTestId("nav-knowledge").click();
    await page.getByRole("link", { name: /^Wiki$/i }).click();
    await page.waitForURL(/\/wiki\/status/, { timeout: 60_000 });

    // Empty state visible since hasWiki === false.
    await expect(page.getByRole("heading", { name: /generate the wiki/i })).toBeVisible();

    // Go to Configure, launch the generation flow.
    await page.getByTestId("wiki-tab-configure").click();
    await page.waitForURL(/\/wiki\/configure/);
    await expect(page.getByTestId("generate-wiki-trigger")).toBeVisible();
  });

  test("full: Wiki status dashboard loads with sidebar tabs", async ({ page }) => {
    test.setTimeout(120_000);
    await signIn(page, "full", "e2e-full");
    await page.getByTestId("workspace-card").first().click();
    await page.waitForURL(/\/workspace\/[^/]+\/sources/);

    await page.getByTestId("nav-knowledge").click();
    await page.getByRole("link", { name: /^Wiki$/i }).click();
    await page.waitForURL(/\/wiki\/status/);

    // Sidebar tabs visible, not locked for full persona.
    await expect(page.getByTestId("wiki-sidebar")).toBeVisible();
    await expect(page.getByTestId("wiki-tab-status")).toBeVisible();
    await expect(page.getByTestId("wiki-tab-status")).not.toHaveAttribute("data-locked", "true");
    await expect(page.getByTestId("wiki-tab-view")).not.toHaveAttribute("data-locked", "true");
    await expect(page.getByTestId("wiki-tab-logs")).not.toHaveAttribute("data-locked", "true");
  });

  test("/workspaces hides navbar center destinations", async ({ page }) => {
    test.setTimeout(60_000);
    await signIn(page, "full", "e2e-full");
    // We landed on /workspaces. Center destinations should NOT render.
    await expect(page.getByTestId("nav-destinations")).toHaveCount(0);
  });
});

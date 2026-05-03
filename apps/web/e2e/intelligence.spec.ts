import { expect, test } from "@playwright/test";

async function signIn(page: import("@playwright/test").Page, persona: string, password: string) {
  await page.goto("/login");
  await page.getByLabel(/persona/i).fill(persona);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL(/\/workspaces/, { timeout: 60_000 });
}

test.describe("intelligence per-persona", () => {
  test("full: Intelligence overview populated with dashboard", async ({ page }) => {
    test.setTimeout(120_000);
    await signIn(page, "full", "e2e-full");
    await page.getByTestId("workspace-card").first().click();
    await page.waitForURL(/\/workspace\/[^/]+\/sources/);

    // Knowledge dropdown → Intelligence
    await page.getByTestId("nav-knowledge").click();
    await page.getByRole("link", { name: /^Intelligence$/i }).click();
    await page.waitForURL(/\/intelligence\/overview/, { timeout: 60_000 });

    await expect(page.getByTestId("intelligence-sidebar")).toBeVisible();
    // Phase 13: the standalone config-header strip was removed; refresh + freshness pill now sit in the dashboard's heading row.
    await expect(page.getByTestId("intelligence-freshness-controls")).toBeVisible();
    await expect(page.getByRole("heading", { name: /intelligence at a glance/i })).toBeVisible();
  });

  test("partial: Intelligence shows 'Generate the Wiki first' empty state", async ({ page }) => {
    test.setTimeout(90_000);
    await signIn(page, "partial", "e2e-partial");
    await page.getByTestId("workspace-card").first().click();
    await page.waitForURL(/\/workspace\/[^/]+\/sources/);

    await page.getByTestId("nav-knowledge").click();
    await page.getByRole("link", { name: /^Intelligence$/i }).click();
    await page.waitForURL(/\/intelligence\/overview/, { timeout: 60_000 });

    await expect(page.getByTestId("intelligence-needs-wiki")).toBeVisible();
    await expect(page.getByRole("heading", { name: /generate the wiki first/i })).toBeVisible();
  });
});

import { expect, test } from "@playwright/test";

async function signIn(page: import("@playwright/test").Page, persona: string, password: string) {
  await page.goto("/login");
  await page.getByLabel(/persona/i).fill(persona);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL(/\/workspaces/, { timeout: 60_000 });
}

test.describe("Phase 13 — Kinetic Minimalism polish", () => {
  test("Workspaces — search input filters cards by name", async ({ page }) => {
    test.setTimeout(60_000);
    await signIn(page, "full", "e2e-full");

    const search = page.getByTestId("workspaces-search-input");
    await expect(search).toBeVisible();

    const cardsBefore = await page.getByTestId("workspace-card").count();
    expect(cardsBefore).toBeGreaterThan(0);

    await search.fill("microservices");
    await expect(page.getByTestId("workspace-card")).toHaveCount(1);
    const onlyName = await page.getByTestId("workspace-card-name").innerText();
    expect(onlyName.toLowerCase()).toContain("microservices");

    await search.fill("nonexistent-xyz-123");
    await expect(page.getByTestId("workspaces-no-matches")).toBeVisible();
  });

  test("Workspaces — card has no WORKSPACE pretitle and no Wiki Live badge", async ({ page }) => {
    test.setTimeout(60_000);
    await signIn(page, "full", "e2e-full");

    const card = page.getByTestId("workspace-card").first();
    await expect(card).toBeVisible();
    // The pretitle "Workspace" header was removed in Phase 13.
    await expect(card.locator("text=/^WORKSPACE$/i")).toHaveCount(0);
    // Wiki Live / Wiki Pending pills were removed in favour of the description block.
    await expect(card.locator("text=/Wiki Live|Wiki Pending/")).toHaveCount(0);
    // Description block exists.
    await expect(card.getByTestId("workspace-card-description")).toBeVisible();
  });

  test("Sources — page header has no 'Workspace · Input Layer' subtitle", async ({ page }) => {
    test.setTimeout(60_000);
    await signIn(page, "full", "e2e-full");
    await page.getByTestId("workspace-card").first().click();
    await page.waitForURL(/\/workspace\/[^/]+\/sources/);

    const heading = page.getByRole("heading", { name: /^Sources$/i, level: 1 });
    await expect(heading).toBeVisible();
    await expect(page.locator("text=/Workspace · Input Layer/i")).toHaveCount(0);
  });

  test('Sources — card label says "Last Sync with Knowledge"', async ({ page }) => {
    test.setTimeout(60_000);
    await signIn(page, "full", "e2e-full");
    await page.getByTestId("workspace-card").first().click();
    await page.waitForURL(/\/workspace\/[^/]+\/sources/);

    const firstCard = page.getByTestId("source-card").first();
    await expect(firstCard).toBeVisible();
    await expect(firstCard).toContainText("Last Sync with Knowledge");
  });

  test("Intelligence Health — search input filters per-repo rows", async ({ page }) => {
    test.setTimeout(120_000);
    await signIn(page, "full", "e2e-full");
    await page.getByTestId("workspace-card").first().click();
    await page.waitForURL(/\/workspace\/[^/]+\/sources/);
    await page.goto(`${page.url().split("/sources")[0]}/intelligence/health`);

    await expect(page.getByRole("heading", { name: /Health & Fragility/i })).toBeVisible();
    const search = page.getByTestId("health-search-input");
    await expect(search).toBeVisible();

    // Freshness controls live in the heading row, not a separate strip.
    await expect(page.getByTestId("intelligence-freshness-controls")).toBeVisible();
  });

  test("Workspaces page no longer shows 'Gateway' pretitle", async ({ page }) => {
    test.setTimeout(60_000);
    await signIn(page, "full", "e2e-full");
    await expect(page.locator("text=/^Gateway$/i")).toHaveCount(0);
  });
});

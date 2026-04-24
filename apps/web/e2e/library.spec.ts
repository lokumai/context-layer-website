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

async function gotoLibrary(page: import("@playwright/test").Page) {
  await page.getByTestId("workspace-card").first().click();
  await page.waitForURL(/\/workspace\/[^/]+\/sources/);
  await page.goto(`${page.url().split("/sources")[0]}/library`);
  await expect(page.getByTestId("library-surface")).toBeVisible({ timeout: 30_000 });
}

test.describe("Library per-persona", () => {
  test("partial: Library nav entry is locked", async ({ page }) => {
    test.setTimeout(90_000);
    await signIn(page, "partial", "e2e-partial");
    await page.getByTestId("workspace-card").first().click();
    await page.waitForURL(/\/workspace\/[^/]+\/sources/);

    const nav = page.getByTestId("nav-library");
    await expect(nav).toBeVisible();
    await expect(nav).toHaveAttribute("data-locked", "true");
  });

  test("full: lists the 21 Phase-3 artifacts and respects bundle filter", async ({ page }) => {
    test.setTimeout(120_000);
    await signIn(page, "full", "e2e-full");
    await gotoLibrary(page);

    await expect(page.getByTestId("library-sidebar")).toBeVisible();
    await expect(page.getByTestId("library-grid")).toBeVisible();

    // 21 mock artifacts are seeded.
    const tiles = page.locator('[data-testid^="artifact-tile-"]');
    await expect(tiles).toHaveCount(21);

    // Filter by the agentify bundle → 5 cards (per Phase 3 mocks).
    await page.getByTestId("bundle-filter-agentify").click();
    await expect(tiles).toHaveCount(5);
  });

  test("full: deleting an artifact drops the count", async ({ page }) => {
    test.setTimeout(120_000);
    await signIn(page, "full", "e2e-full");
    await gotoLibrary(page);

    const before = await page.locator('[data-testid^="artifact-tile-"]').count();
    expect(before).toBeGreaterThan(0);

    const firstTile = page.locator('[data-testid^="artifact-tile-"]').first();
    await firstTile.getByTestId("actions-menu-button").click();
    await page.getByTestId("actions-item-delete").click();

    await expect(page.getByTestId("delete-confirm")).toBeVisible();
    await page.getByRole("button", { name: /^delete$/i }).click();

    await expect(page.locator('[data-testid^="artifact-tile-"]')).toHaveCount(before - 1);
  });

  test("full: grid ↔ list toggle and preview opens", async ({ page }) => {
    test.setTimeout(120_000);
    await signIn(page, "full", "e2e-full");
    await gotoLibrary(page);

    await page.getByTestId("library-view-list").click();
    await expect(page.getByTestId("library-list")).toBeVisible();
    const rows = page.locator('[data-testid^="artifact-row-"]');
    await expect(rows.first()).toBeVisible();

    await page.getByTestId("library-view-grid").click();
    await expect(page.getByTestId("library-grid")).toBeVisible();

    const firstTile = page.locator('[data-testid^="artifact-tile-"]').first();
    await firstTile.getByTestId("actions-menu-button").click();
    await page.getByTestId("actions-item-view").click();

    // Preview modal opens for a markdown artifact.
    await expect(page.locator('[data-testid="preview-modal"], [data-testid="artifact-preview-multimodal"]').first()).toBeVisible();
  });
});

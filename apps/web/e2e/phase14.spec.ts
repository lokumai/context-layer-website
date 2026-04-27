import { expect, test } from "@playwright/test";

async function signIn(page: import("@playwright/test").Page, persona: string, password: string) {
  await page.goto("/login");
  await page.getByLabel(/persona/i).fill(persona);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL(/\/workspaces/, { timeout: 60_000 });
}

async function gotoSources(page: import("@playwright/test").Page) {
  await page.getByTestId("workspace-card").first().click();
  await page.waitForURL(/\/workspace\/[^/]+\/sources/);
}

test.describe("Phase 14 — Sources Manager & Modal Upgrades", () => {
  test("full persona — every source card shows Indexed + Synced", async ({ page }) => {
    test.setTimeout(60_000);
    await signIn(page, "full", "e2e-full");
    await gotoSources(page);

    const firstCard = page.getByTestId("source-card").first();
    await expect(firstCard).toBeVisible();
    await expect(firstCard).toContainText(/Indexed/i);
    await expect(firstCard.getByTestId("knowledge-sync-synced")).toBeVisible();
  });

  test("Add-Source chooser uses vertical sectioned layout with primary connectors", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await signIn(page, "full", "e2e-full");
    await gotoSources(page);

    // Click the Add Source CTA — it lives in the sources toolbar.
    await page
      .getByRole("button", { name: /Add Source/i })
      .first()
      .click();
    await expect(page.getByTestId("add-source-chooser")).toBeVisible();

    // Three buckets visible.
    await expect(page.getByTestId("bucket-code")).toBeVisible();
    await expect(page.getByTestId("bucket-docs")).toBeVisible();
    await expect(page.getByTestId("bucket-discussion")).toBeVisible();

    // Code primary connectors visible without expanding.
    await expect(page.getByTestId("connector-github-github")).toBeVisible();
    await expect(page.getByTestId("connector-gitlab-gitlab")).toBeVisible();

    // Bitbucket is hidden behind "More options" until expanded.
    await expect(page.getByTestId("connector-bitbucket-bitbucket")).toHaveCount(0);

    await page.getByTestId("bucket-code-more").click();
    await expect(page.getByTestId("connector-bitbucket-bitbucket")).toBeVisible();

    // No bottom blue badge spinner — that legacy element is gone.
    await expect(page.locator('text="Connecting..."')).toHaveCount(0);
  });

  test("Connect spinner renders on the connector card itself + new source ends up Indexed + Outdated", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await signIn(page, "full", "e2e-full");
    await gotoSources(page);

    // Wait for hydration to populate the existing 9 sources before snapshotting.
    await expect(page.getByTestId("source-card").first()).toBeVisible({ timeout: 30_000 });
    const sourcesCountBefore = await page.getByTestId("source-card").count();
    expect(sourcesCountBefore).toBeGreaterThanOrEqual(9);

    await page
      .getByRole("button", { name: /Add Source/i })
      .first()
      .click();
    await expect(page.getByTestId("add-source-chooser")).toBeVisible();

    // Click GitHub — spinner appears in the strip itself.
    await page.getByTestId("connector-github-github").click();
    await expect(page.getByTestId("connector-spinner")).toBeVisible({ timeout: 5_000 });

    // Wait for the modal to close (job finishes after ~4.5 s).
    await expect(page.getByTestId("add-source-chooser")).toHaveCount(0, { timeout: 15_000 });

    // The new source appears in the grid with both badges.
    await expect(page.getByTestId("source-card")).toHaveCount(sourcesCountBefore + 1);
    const newCard = page.locator('[data-testid="source-card"]:has-text("GitHub new source")');
    await expect(newCard).toBeVisible();
    await expect(newCard).toContainText(/Indexed/i);
    await expect(newCard.getByTestId("knowledge-sync-outdated")).toBeVisible();
  });

  test("Source preview slide-over animates in, expand toggle widens the panel, real preview content renders", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await signIn(page, "full", "e2e-full");
    await gotoSources(page);

    // Open the first source's preview.
    await page.getByTestId("source-card").first().click();
    const panel = page.getByTestId("source-preview-panel");
    await expect(panel).toBeVisible();

    // Default collapsed state.
    await expect(panel).toHaveAttribute("data-expanded", "false");
    const startBox = await panel.boundingBox();
    expect(startBox?.width ?? 0).toBeGreaterThan(400);
    expect(startBox?.width ?? 0).toBeLessThan(700);

    // Real per-kind preview body (the full persona's first source is code).
    await expect(panel.getByTestId("preview-code")).toBeVisible();

    // Expand toggle widens the panel.
    await page.getByTestId("source-preview-expand").click();
    await expect(panel).toHaveAttribute("data-expanded", "true");
    await page.waitForTimeout(400);
    const endBox = await panel.boundingBox();
    expect(endBox?.width ?? 0).toBeGreaterThan(700);

    // The drag handle is reachable.
    await expect(page.getByTestId("source-preview-drag-handle")).toBeVisible();

    // Close via Escape.
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("source-preview-panel")).toHaveCount(0);
  });
});

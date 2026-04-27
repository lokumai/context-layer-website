import { expect, test } from "@playwright/test";

async function signIn(page: import("@playwright/test").Page, persona: string, password: string) {
  await page.goto("/login");
  await page.getByLabel(/persona/i).fill(persona);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL(/\/workspaces/, { timeout: 60_000 });
}

async function gotoSourcesAsFull(page: import("@playwright/test").Page) {
  await signIn(page, "full", "e2e-full");
  await page.getByTestId("workspace-card").first().click();
  await page.waitForURL(/\/workspace\/[^/]+\/sources/);
}

test.describe("Phase 16 — Wiki Logs Audit & Graph Depth", () => {
  test("Wiki Logs — row expands inline with agent steps + view-diff toggle", async ({ page }) => {
    test.setTimeout(120_000);
    await gotoSourcesAsFull(page);
    const id = page.url().match(/\/workspace\/([^/]+)\//)?.[1];
    await page.goto(`/workspace/${id}/wiki/logs`);

    const firstRow = page.getByTestId("log-row").first();
    await expect(firstRow).toBeVisible();
    await expect(firstRow).toHaveAttribute("data-state", "collapsed");

    await firstRow.click();
    await expect(firstRow).toHaveAttribute("data-state", "expanded");

    // Per-step accordions render.
    const steps = firstRow.getByTestId("log-step");
    await expect(steps.first()).toBeVisible();
    expect(await steps.count()).toBeGreaterThan(0);

    // View-diff toggle reveals the diff in-place.
    await firstRow.getByTestId("log-toggle-diff").click();
    const diff = firstRow.getByTestId("log-diff");
    await expect(diff).toBeVisible();
    const diffText = await diff.innerText();
    expect(diffText).toMatch(/^\+/m);
    expect(diffText).toMatch(/^-/m);
  });

  test("Knowledge Graph — search bar filters node count", async ({ page }) => {
    test.setTimeout(120_000);
    await gotoSourcesAsFull(page);
    const id = page.url().match(/\/workspace\/([^/]+)\//)?.[1];
    await page.goto(`/workspace/${id}/intelligence/overview`);

    // The Overview page has a "Click to expand" button next to the KG snapshot — open the modal.
    await page.getByRole("button", { name: /click to expand/i }).click();
    const modal = page.getByTestId("kg-modal");
    await expect(modal).toBeVisible();

    const countChip = page.getByTestId("kg-node-count");
    await expect(countChip).toBeVisible();
    const beforeText = await countChip.innerText();
    const beforeMatch = beforeText.match(/^(\d+)\/(\d+)/);
    expect(beforeMatch).not.toBeNull();
    const totalBefore = beforeMatch ? Number(beforeMatch[2]) : 0;
    expect(totalBefore).toBeGreaterThan(0);

    await page.getByTestId("kg-search-input").fill("offering");
    const afterMatch = (await countChip.innerText()).match(/^(\d+)\/(\d+)/);
    expect(afterMatch).not.toBeNull();
    const filtered = afterMatch ? Number(afterMatch[1]) : 0;
    expect(filtered).toBeLessThan(totalBefore);

    // No-results case.
    await page.getByTestId("kg-search-input").fill("nonexistent-xyz-123");
    await expect(page.getByTestId("kg-no-results")).toBeVisible();
  });

  test("First-Time Wizard — partial persona sees interactive steps 3-5", async ({ page }) => {
    test.setTimeout(60_000);
    await signIn(page, "partial", "e2e-partial");
    await page.getByTestId("workspace-card").first().click();
    await page.waitForURL(/\/workspace\/[^/]+\/sources/);

    const wizard = page.getByTestId("first-time-wizard");
    await expect(wizard).toBeVisible();

    // Steps 3-5 each render — no more "Phase 7+" stub.
    await expect(wizard.locator("text=/Phase 7\\+/")).toHaveCount(0);
    await expect(page.getByTestId("wizard-step-3")).toBeVisible();
    await expect(page.getByTestId("wizard-step-4")).toBeVisible();
    await expect(page.getByTestId("wizard-step-5")).toBeVisible();

    // Step 3 has a working CTA → /wiki/configure.
    const step3Link = page.getByTestId("wizard-step-3-link");
    await expect(step3Link).toBeVisible();
    await step3Link.click();
    await page.waitForURL(/\/wiki\/configure/, { timeout: 15_000 });
  });
});

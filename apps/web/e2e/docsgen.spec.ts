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

test.describe("DocsGen per-persona", () => {
  test("full: structure-architecture tab shows 4 Done cards", async ({ page }) => {
    test.setTimeout(120_000);
    await signIn(page, "full", "e2e-full");
    await page.getByTestId("workspace-card").first().click();
    await page.waitForURL(/\/workspace\/[^/]+\/sources/);

    await page.getByTestId("nav-generate").click();
    await page.getByRole("link", { name: /^DocsGen$/i }).click();
    await page.waitForURL(/\/generate\/docsgen\/structure-architecture/, { timeout: 60_000 });

    await expect(page.getByTestId("docsgen-bundle-view")).toBeVisible();
    await expect(page.getByTestId("docsgen-tabs-header")).toBeVisible();

    // All 4 structure-architecture cards should show Done state for full persona.
    for (const slug of ["repo-map", "dependency-map", "data-flow-diagram", "db-schema"]) {
      const card = page.getByTestId(`artifact-card-${slug}`);
      await expect(card).toBeVisible();
      await expect(card).toHaveAttribute("data-state", "done");
    }
  });

  test("full: clicking Regenerate flips a card through running and back to done", async ({ page }) => {
    test.setTimeout(180_000);
    await signIn(page, "full", "e2e-full");
    await page.getByTestId("workspace-card").first().click();
    await page.waitForURL(/\/workspace\/[^/]+\/sources/);

    await page.goto(`${page.url().split("/sources")[0]}/generate/docsgen/structure-architecture`);

    const card = page.getByTestId("artifact-card-repo-map");
    await expect(card).toHaveAttribute("data-state", "done");

    // Click the Regenerate icon button inside the card.
    await card.getByRole("button", { name: /regenerate/i }).click();

    // Modal opens — submit with defaults.
    await expect(page.getByTestId("generate-modal")).toBeVisible();
    await page.getByTestId("generate-modal").getByRole("button", { name: /^regenerate$/i }).click();

    // Running state.
    await expect(card).toHaveAttribute("data-state", "running", { timeout: 5_000 });

    // Back to Done within the 8 s simulated job window.
    await expect(card).toHaveAttribute("data-state", "done", { timeout: 20_000 });
  });

  test("partial: DocsGen Generate nav entry is locked", async ({ page }) => {
    test.setTimeout(60_000);
    await signIn(page, "partial", "e2e-partial");
    await page.getByTestId("workspace-card").first().click();
    await page.waitForURL(/\/workspace\/[^/]+\/sources/);

    const nav = page.getByTestId("nav-generate");
    await expect(nav).toHaveAttribute("data-locked", "true");
  });
});

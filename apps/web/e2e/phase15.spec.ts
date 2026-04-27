import { expect, test } from "@playwright/test";

async function signIn(page: import("@playwright/test").Page, persona: string, password: string) {
  await page.goto("/login");
  await page.getByLabel(/persona/i).fill(persona);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL(/\/workspaces/, { timeout: 60_000 });
}

async function gotoWorkspaceSources(page: import("@playwright/test").Page) {
  await page.getByTestId("workspace-card").first().click();
  await page.waitForURL(/\/workspace\/[^/]+\/sources/);
}

test.describe("Phase 15 — Content Rendering & Illusion of Processing", () => {
  test("Wiki View — real page body loads (no placeholder)", async ({ page }) => {
    test.setTimeout(60_000);
    await signIn(page, "full", "e2e-full");
    await gotoWorkspaceSources(page);

    const id = page.url().match(/\/workspace\/([^/]+)\//)?.[1];
    expect(id).toBeTruthy();

    await page.goto(`/workspace/${id}/wiki/view/api-gateway/overview`);

    // Phase 9+ placeholder must be gone.
    await expect(page.locator("text=/Page preview for/")).toHaveCount(0, { timeout: 15_000 });
    // Real markdown renders an h1.
    await expect(page.locator("main h1").first()).toBeVisible({ timeout: 15_000 });
  });

  test("Wiki View — code blocks render with syntax-highlighter wrapper", async ({ page }) => {
    test.setTimeout(60_000);
    await signIn(page, "full", "e2e-full");
    await gotoWorkspaceSources(page);
    const id = page.url().match(/\/workspace\/([^/]+)\//)?.[1];
    // architecture has multiple python/json code fences — perfect for testing
    // syntax highlighting; overview.md is prose-only.
    await page.goto(`/workspace/${id}/wiki/view/api-gateway/architecture`);
    await expect(page.locator("main h1").first()).toBeVisible({ timeout: 15_000 });

    // react-syntax-highlighter (Prism + oneDark) renders nested span tokens
    // with inline colour styles. Asserting at least one such span confirms
    // highlighting is active.
    const tokenSpans = page.locator('main pre span[style*="color"]');
    await expect(tokenSpans.first()).toBeVisible({ timeout: 15_000 });
    const tokenCount = await tokenSpans.count();
    expect(tokenCount).toBeGreaterThan(5);
  });

  test("DocsGen — Triangle loader visible during regenerate", async ({ page }) => {
    test.setTimeout(180_000);
    await signIn(page, "full", "e2e-full");
    await gotoWorkspaceSources(page);
    const id = page.url().match(/\/workspace\/([^/]+)\//)?.[1];

    await page.goto(`/workspace/${id}/generate/docsgen/structure-architecture`);

    const card = page.getByTestId("artifact-card-repo-map");
    await expect(card).toHaveAttribute("data-state", "done", { timeout: 30_000 });

    await card.getByRole("button", { name: /regenerate/i }).click();
    await expect(page.getByTestId("generate-modal")).toBeVisible();
    await page
      .getByTestId("generate-modal")
      .getByRole("button", { name: /^regenerate$/i })
      .click();

    // Triangle loader appears inside the running card.
    await expect(card.getByTestId("triangle-loader")).toBeVisible({ timeout: 5_000 });
    // TrickleLogs panel also visible.
    await expect(card.getByTestId("trickle-logs")).toBeVisible();

    // Card eventually returns to Done.
    await expect(card).toHaveAttribute("data-state", "done", { timeout: 20_000 });
  });
});

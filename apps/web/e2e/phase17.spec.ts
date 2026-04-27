import { expect, test } from "@playwright/test";

async function signIn(page: import("@playwright/test").Page, persona: string, password: string) {
  await page.goto("/login");
  await page.getByLabel(/persona/i).fill(persona);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL(/\/workspaces/, { timeout: 60_000 });
}

async function gotoOmniBoard(page: import("@playwright/test").Page) {
  await signIn(page, "full", "e2e-full");
  await page.getByTestId("workspace-card").first().click();
  await page.waitForURL(/\/workspace\/[^/]+\/sources/);
  await page.goto(`${page.url().split("/sources")[0]}/generate/omniboard`);
  await expect(page.getByTestId("omniboard-landing")).toBeVisible();
}

async function generateSlides(page: import("@playwright/test").Page) {
  await page.getByTestId("omniboard-option-slides-summary-slides").click();
  await expect(page.getByTestId("omniboard-session")).toBeVisible();
  await page.getByTestId("chatbot-input").fill("Onboard new engineers onto the saga flows.");
  await page.getByTestId("chatbot-send").click();
  const generate = page.getByTestId("omniboard-generate-button");
  await expect(generate).toBeEnabled({ timeout: 30_000 });
  await generate.click();
  await expect(page.getByTestId("omniboard-generation-progress")).toBeVisible();
  await expect(page.getByTestId("omniboard-exploration")).toBeVisible({ timeout: 30_000 });
}

test.describe("Phase 17 — OmniBoard NotebookLM Exploration", () => {
  test("post-generation lands in exploration, not Done", async ({ page }) => {
    test.setTimeout(180_000);
    await gotoOmniBoard(page);
    await generateSlides(page);

    // Old Done testid is gone.
    await expect(page.getByTestId("omniboard-done")).toHaveCount(0);
    // New split-view layout is live.
    await expect(page.getByTestId("omniboard-exploration-viewer")).toBeVisible();
    await expect(page.getByTestId("omniboard-exploration-chat")).toBeVisible();
    // Saved-to-Library badge in the header.
    await expect(page.getByText(/saved to library/i)).toBeVisible();
  });

  test("artifact viewer renders the modality-correct stub (slides)", async ({ page }) => {
    test.setTimeout(180_000);
    await gotoOmniBoard(page);
    await generateSlides(page);

    const viewer = page.getByTestId("omniboard-exploration-viewer");
    await expect(viewer.getByTestId("preview-slides-stub")).toBeVisible();
  });

  test("exploration chat sends and streams a reply", async ({ page }) => {
    test.setTimeout(180_000);
    await gotoOmniBoard(page);
    await generateSlides(page);

    // Click a suggested prompt — it sends as a user message.
    await page.getByTestId("exploration-suggested-prompt").first().click();

    // Assistant message bubble appears with non-empty content.
    const assistant = page.getByTestId("chatbot-message-assistant").last();
    await expect(assistant).toBeVisible({ timeout: 20_000 });
    await expect(assistant).not.toBeEmpty();
  });

  test('"Plan another" returns to the modality-picker landing', async ({ page }) => {
    test.setTimeout(180_000);
    await gotoOmniBoard(page);
    await generateSlides(page);

    await page.getByTestId("exploration-plan-another").click();
    await expect(page.getByTestId("omniboard-landing")).toBeVisible();
    await expect(page.getByTestId("omniboard-exploration")).toHaveCount(0);
  });
});

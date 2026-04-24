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

test.describe("OmniBoard", () => {
  test("full: pick modality → chat → generate → success grows artifact count", async ({ page }) => {
    test.setTimeout(240_000);
    await signIn(page, "full", "e2e-full");
    await page.getByTestId("workspace-card").first().click();
    await page.waitForURL(/\/workspace\/[^/]+\/sources/);

    await page.goto(`${page.url().split("/sources")[0]}/generate/omniboard`);
    await expect(page.getByTestId("omniboard-landing")).toBeVisible();

    // Capture starting artifact count from the Zustand store.
    const before = await page.evaluate(() => {
      const raw = localStorage.getItem("context-layer:full");
      if (!raw) return 0;
      const parsed = JSON.parse(raw);
      return parsed.state?.artifacts?.length ?? 0;
    });

    // Pick Slides · Summary Slides.
    await page.getByTestId("omniboard-option-slides-summary-slides").click();
    await expect(page.getByTestId("omniboard-session")).toBeVisible();

    // Generate button is initially disabled (no user goal yet).
    const generate = page.getByTestId("omniboard-generate-button");
    await expect(generate).toBeDisabled();

    // Type a goal in the chat input.
    await page.getByTestId("chatbot-input").fill("Onboard new engineers onto the saga flows.");
    await page.getByTestId("chatbot-send").click();

    // Plan panel picks up the goal, Generate unlocks.
    await expect(generate).toBeEnabled({ timeout: 30_000 });
    await generate.click();

    // Progress, then Done.
    await expect(page.getByTestId("omniboard-generation-progress")).toBeVisible();
    await expect(page.getByTestId("omniboard-done")).toBeVisible({ timeout: 30_000 });

    const after = await page.evaluate(() => {
      const raw = localStorage.getItem("context-layer:full");
      if (!raw) return 0;
      const parsed = JSON.parse(raw);
      return parsed.state?.artifacts?.length ?? 0;
    });
    expect(after).toBe(before + 1);
  });
});

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

test.describe("Chatbot per-persona", () => {
  test("partial: Chatbot nav entry is locked", async ({ page }) => {
    test.setTimeout(90_000);
    await signIn(page, "partial", "e2e-partial");
    await page.getByTestId("workspace-card").first().click();
    await page.waitForURL(/\/workspace\/[^/]+\/sources/);

    const chatbotNav = page.getByTestId("nav-chatbot");
    await expect(chatbotNav).toBeVisible();
    await expect(chatbotNav).toHaveAttribute("data-locked", "true");
  });

  test("full: full chatbot page streams an answer with a citation drawer", async ({ page }) => {
    test.setTimeout(120_000);
    await signIn(page, "full", "e2e-full");
    await page.getByTestId("workspace-card").first().click();
    await page.waitForURL(/\/workspace\/[^/]+\/sources/);

    await page.getByTestId("nav-chatbot").click();
    await page.waitForURL(/\/chatbot$/, { timeout: 60_000 });

    await expect(page.getByTestId("chatbot-full-page")).toBeVisible();
    await expect(page.getByTestId("chatbot-thread-sidebar")).toBeVisible();
    await expect(page.getByTestId("chatbot-grounding-row")).toBeVisible();

    // Empty state visible with suggested prompts.
    await expect(page.getByTestId("chatbot-empty-state")).toBeVisible();
    const firstPrompt = page.getByTestId("chatbot-suggested-prompt").first();
    await expect(firstPrompt).toBeVisible();

    // Type a question that should match qa-007 (JWT validation).
    await page.getByTestId("chatbot-input").fill("Where is JWT validation implemented?");
    await page.getByTestId("chatbot-send").click();

    // User message appears.
    await expect(page.getByTestId("chatbot-message-user")).toBeVisible();

    // Assistant message eventually renders with at least one citation chip.
    await expect(page.getByTestId("chatbot-citations").first()).toBeVisible({ timeout: 30_000 });
    const firstCitation = page.getByTestId("citation-chip").first();
    await expect(firstCitation).toBeVisible();

    // Clicking a citation opens the drawer.
    await firstCitation.click();
    await expect(page.getByTestId("citation-drawer")).toBeVisible();
  });

  test("full: Wiki View page mounts the chatbot side dock", async ({ page }) => {
    test.setTimeout(120_000);
    await signIn(page, "full", "e2e-full");
    await page.getByTestId("workspace-card").first().click();
    await page.waitForURL(/\/workspace\/[^/]+\/sources/);

    await page.getByTestId("nav-knowledge").click();
    await page.getByRole("link", { name: /^Wiki$/i }).click();
    await page.waitForURL(/\/wiki\/status/, { timeout: 60_000 });

    await page.goto(page.url().replace("/wiki/status", "/wiki/view"));

    await expect(page.getByTestId("chatbot-dock-button")).toBeVisible();
    await page.getByTestId("chatbot-dock-button").click();
    await expect(page.getByTestId("chatbot-slide-over")).toBeVisible();
  });
});

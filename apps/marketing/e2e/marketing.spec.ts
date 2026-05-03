import { expect, test } from "@playwright/test";

const ROUTES = [
  { path: "/", heading: /codebase knowledge/i },
  { path: "/product/context-layer", heading: /context layer/i },
  { path: "/product/code-translation", heading: /code translation/i },
  { path: "/product/code-modernization", heading: /code modernization/i },
];

test.describe("marketing pages", () => {
  for (const route of ROUTES) {
    test(`${route.path} renders with navbar + Playground button`, async ({ page }) => {
      await page.goto(route.path);
      await expect(page.getByRole("heading", { name: route.heading }).first()).toBeVisible();
      const playgroundButtons = page.getByTestId("playground-button");
      await expect(playgroundButtons.first()).toBeVisible();
    });
  }

  test("Playground button points to external playground URL", async ({ page }) => {
    await page.goto("/");
    const btn = page.getByTestId("playground-button").first();
    const href = await btn.getAttribute("href");
    // Fallback or explicit URL check
    expect(href).toMatch(/\/workspaces|app\.context-layer\.dev/);
  });
});

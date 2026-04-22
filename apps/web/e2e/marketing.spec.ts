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

  test("Playground button in navbar routes to /login", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("playground-button").first().click();
    await expect(page).toHaveURL(/\/login/);
  });
});

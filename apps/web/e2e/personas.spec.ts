// apps/web/e2e/personas.spec.ts
import { test, expect } from "@playwright/test";

test.describe.skip("personas", () => {
  test("full persona: Library is populated immediately", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /full/i }).click();
    await expect(page).toHaveURL(/\/play\/workspaces/);
    await page.getByRole("link", { name: /microservices-product-catalog/ }).click();
    await page.getByRole("link", { name: /library/i }).click();
    await expect(page.locator("[data-library-item]")).toHaveCount(12, { timeout: 5_000 });
  });

  test("empty persona: lands on empty workspaces; quick-populate works", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /empty/i }).click();
    await expect(page.getByText(/Create your first workspace/i)).toBeVisible();
    await page.getByRole("button", { name: /create workspace/i }).click();
    await page.getByPlaceholder(/workspace name/i).fill("demo");
    await page.getByRole("button", { name: /create/i }).click();
    await page.getByRole("button", { name: /quick-populate demo sources/i }).click();
    await expect(page.locator("[data-source-card]").first()).toBeVisible();
  });

  test("partial persona: wiki visible, library empty, DocsGen cards idle", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /partial/i }).click();
    await page.getByRole("link", { name: /microservices-product-catalog/ }).click();
    await page.getByRole("link", { name: /wiki/i }).click();
    await expect(page.getByText(/Wiki Status/i)).toBeVisible();
    await page.getByRole("link", { name: /library/i }).click();
    await expect(page.getByText(/Generate your first artifact/i)).toBeVisible();
  });

  test("reset action: full persona resets to seed after mutation", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /full/i }).click();
    await page.getByRole("link", { name: /microservices-product-catalog/ }).click();
    page.on("dialog", (d) => d.accept());
    await page.getByRole("button", { name: /reset/i }).click();
    await expect(page.locator("[data-source-card]").first()).toBeVisible();
  });
});

import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load homepage successfully", async ({ page }) => {
    await page.goto("/");

    // Check page title
    await expect(page).toHaveTitle(/Property Investment/i);

    // Check main heading
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();

    // Check navigation
    const nav = page.getByRole("navigation");
    await expect(nav).toBeVisible();
  });

  test("should have working navigation links", async ({ page }) => {
    await page.goto("/");

    // Test calculator link
    const calculatorLink = page.getByRole("link", { name: /calculator/i });
    if (await calculatorLink.isVisible()) {
      await calculatorLink.click();
      await expect(page).toHaveURL(/calculator/i);
    }
  });
});


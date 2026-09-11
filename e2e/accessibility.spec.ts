import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

async function expectNoViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
}

test("home feed has no accessibility violations", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main ul li img").first()).toBeVisible();

  await expectNoViolations(page);
});

test("photo details page has no accessibility violations", async ({
  page,
}) => {
  await page.goto("/");

  const firstPhotoHref = await page
    .locator("main ul li a[href^='/photos/']")
    .first()
    .getAttribute("href");

  await page.goto(firstPhotoHref!);
  await expect(page.locator("main figure img")).toBeVisible();

  await expectNoViolations(page);
});

test("registration page has no accessibility violations", async ({
  page,
}) => {
  await page.goto("/register");
  await expect(page.getByRole("button", { name: "Join" })).toBeVisible();

  await expectNoViolations(page);
});

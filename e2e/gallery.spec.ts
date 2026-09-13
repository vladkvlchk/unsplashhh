import { expect, test } from "@playwright/test";

test("server renders photos and pagination into the initial html", async ({
  request,
}) => {
  const response = await request.get("/");

  expect(response.ok()).toBeTruthy();

  const html = await response.text();
  const photoLinks = html.match(/href="\/photos\//g) ?? [];

  expect(html).toContain("images.unsplash.com");
  expect(photoLinks.length).toBeGreaterThan(10);
  expect(html).toContain("page=2");
});

test("pagination switches pages and updates the url", async ({ page }) => {
  await page.goto("/");

  const firstImage = page.locator("main ul li img").first();
  await expect(firstImage).toBeVisible();
  const firstAlt = await firstImage.getAttribute("alt");

  await page
    .locator("nav[aria-label='Pagination']")
    .getByRole("link", { name: "2", exact: true })
    .click();

  await expect(page).toHaveURL(/page=2/);
  await expect
    .poll(async () =>
      page.locator("main ul li img").first().getAttribute("alt"),
    )
    .not.toBe(firstAlt);
});

test("columns toggle switches between 3 and 5 columns", async ({ page }) => {
  await page.goto("/");

  const columns = page.locator("main ul", {
    has: page.locator("a[href^='/photos/']"),
  });
  await expect(page.locator("main ul li img").first()).toBeVisible();

  await page.getByRole("button", { name: "5 columns" }).click();
  await expect(columns).toHaveCount(5);

  await page.getByRole("button", { name: "3 columns" }).click();
  await expect(columns).toHaveCount(3);
});

test("search from the header, open a photo, follow a tag", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("searchbox", { name: "Search photos" }).fill("nature");
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/\/search\?query=nature/);
  await expect(
    page.getByRole("heading", { level: 1, name: /nature/i }),
  ).toBeVisible();
  await expect(page.locator("main ul li img").first()).toBeVisible();

  await page.locator("main ul li a[href^='/photos/']").first().click();
  await expect(page).toHaveURL(/\/photos\/.+/);

  const tagLink = page.locator("main a[href^='/t/']").first();
  await expect(tagLink).toBeVisible();
  const tagName = (await tagLink.textContent())?.trim() ?? "";

  await tagLink.click();
  await expect(page).toHaveURL(/\/t\/.+/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    tagName,
    { ignoreCase: true },
  );
  await expect(page.locator("main ul li img").first()).toBeVisible();
});

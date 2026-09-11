import { expect, test } from "@playwright/test";

test("profile requires registration", async ({ page }) => {
  await page.goto("/profile");

  await expect(page).toHaveURL(/\/register/);
});

test("register, save a photo to the collection, remove it, log out", async ({
  page,
}) => {
  await page.goto("/register");

  await page.getByLabel("Name").fill("Test User");
  await page.getByLabel("Email").fill("test.user@example.com");
  await page.getByLabel("Password", { exact: true }).fill("supersecret1");
  await page.getByLabel("Confirm password").fill("supersecret1");
  await page.getByRole("button", { name: "Join" }).click();

  await expect(page).toHaveURL(`/`);
  await expect(page.locator("header nav")).toContainText("Log out");

  const firstCard = page.locator("main ul li").first();
  await expect(firstCard.locator("img").first()).toBeVisible();
  await firstCard.hover();
  await firstCard
    .getByRole("button", { name: "Save to collection" })
    .click();

  await page.goto("/profile");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    /collection/i,
  );

  const savedCards = page.locator("main ul li");
  await expect(savedCards).toHaveCount(1);

  await savedCards.first().hover();
  await savedCards
    .first()
    .getByRole("button", { name: "Remove from collection" })
    .click();

  await expect(
    page.getByText("You have not saved any photos yet."),
  ).toBeVisible();

  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page.locator("header nav")).toContainText("Join");
});

test("registration form validates input client-side", async ({ page }) => {
  await page.goto("/register");

  await page.getByLabel("Name").fill("V");
  await page.getByLabel("Email").fill("not-an-email");
  await page.getByLabel("Password", { exact: true }).fill("short");
  await page.getByLabel("Confirm password").fill("different");
  await page.getByRole("button", { name: "Join" }).click();

  await expect(page).toHaveURL(/\/register/);
  await expect(page.getByText("Enter a valid email address")).toBeVisible();
  await expect(
    page.getByText(/Password must be at least \d+ characters/),
  ).toBeVisible();
  await expect(page.getByText("Passwords do not match")).toBeVisible();
});

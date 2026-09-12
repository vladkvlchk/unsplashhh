import { expect, type Page, test } from "@playwright/test";

const TEST_USER = {
  name: "Test User",
  email: "test.user@example.com",
  password: "supersecret1",
};

async function registerTestUser(page: Page) {
  await page.goto("/register");
  await page.getByLabel("Name").fill(TEST_USER.name);
  await page.getByLabel("Email").fill(TEST_USER.email);
  await page.getByLabel("Password", { exact: true }).fill(TEST_USER.password);
  await page.getByLabel("Confirm password").fill(TEST_USER.password);
  await page.getByRole("button", { name: "Join" }).click();
  await expect(page).toHaveURL("/");
}

test("profile requires registration", async ({ page }) => {
  await page.goto("/profile");

  await expect(page).toHaveURL(/\/register/);
});

test("register, manage the collection, log out and log back in", async ({
  page,
}) => {
  await registerTestUser(page);
  await expect(page.locator("header nav")).toContainText("Log out");

  const firstCard = page.locator("main ul li").first();
  await expect(firstCard.locator("img").first()).toBeVisible();
  await firstCard.hover();
  await firstCard.getByRole("button", { name: "Save to collection" }).click();

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

  await page.getByRole("link", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/login/);

  await page.getByLabel("Email").fill(TEST_USER.email);
  await page.getByLabel("Password").fill("wrong-password");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page.getByText("Invalid email or password")).toBeVisible();

  await page.getByLabel("Password").fill(TEST_USER.password);
  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page).toHaveURL("/");
  await expect(page.locator("header nav")).toContainText("Log out");
});

test("registration rejects an already used email", async ({ page }) => {
  await registerTestUser(page);

  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page.locator("header nav")).toContainText("Join");

  await page.goto("/register");
  await page.getByLabel("Name").fill("Second User");
  await page.getByLabel("Email").fill(TEST_USER.email);
  await page.getByLabel("Password", { exact: true }).fill("anotherpass1");
  await page.getByLabel("Confirm password").fill("anotherpass1");
  await page.getByRole("button", { name: "Join" }).click();

  await expect(
    page.getByText("An account with this email already exists"),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/register/);
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

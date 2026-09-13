import { expect, test } from "@playwright/test";

import { makePhoto } from "@/test-utils/fixtures";

const VISUAL_PHOTO_COUNT = 15;

const ASPECTS: Array<[number, number]> = [
  [1000, 1500],
  [1000, 700],
  [1000, 1000],
  [1000, 1250],
  [1000, 600],
  [1000, 1400],
  [1000, 800],
  [1000, 1100],
  [1000, 1600],
  [1000, 900],
];

const COLORS = [
  "#b7cbd4",
  "#8c7460",
  "#26301f",
  "#d9c9b8",
  "#5b6670",
  "#a48d76",
];

function aspectForIndex(index: number): [number, number] {
  return ASPECTS[index % ASPECTS.length];
}

function transparentSvg(width: number, height: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"/>`;
}

function makeFixturePage(pageNumber: number) {
  const photos = Array.from({ length: VISUAL_PHOTO_COUNT }, (_, index) => {
    const [width, height] = aspectForIndex(index);

    return makePhoto(`v${pageNumber}-${index}`, {
      width,
      height,
      color: COLORS[index % COLORS.length],
    });
  });

  return { photos, totalPages: 5, total: 150 };
}

test("masonry grid keeps its layout at 3 and 5 columns", async ({ page }) => {
  await page.route("**/api/photos**", (route) => {
    const requestedPage = Number(
      new URL(route.request().url()).searchParams.get("page") ?? "1",
    );

    return route.fulfill({ json: makeFixturePage(requestedPage) });
  });
  await page.route("https://images.unsplash.com/**", (route) => {
    const photoIndex = route
      .request()
      .url()
      .match(/photo-v\d+-(\d+)/)?.[1];
    const [width, height] = photoIndex
      ? aspectForIndex(Number(photoIndex))
      : [1, 1];

    return route.fulfill({
      body: transparentSvg(width, height),
      contentType: "image/svg+xml",
    });
  });

  await page.goto("/");
  await page
    .locator("nav[aria-label='Pagination']")
    .getByRole("link", { name: "2", exact: true })
    .click();
  await expect(page.locator("img[alt='Alt for v2-0']")).toBeVisible();

  await page.addStyleTag({
    content: [
      "header, nextjs-portal { display: none !important; }",
      "main ul li { content-visibility: visible !important; }",
    ].join("\n"),
  });
  await page.mouse.move(0, 0);

  const feed = page.locator("main");

  await expect(feed).toHaveScreenshot("masonry-3-columns.png", {
    animations: "disabled",
  });

  await page.getByRole("button", { name: "5 columns" }).click();
  await page.mouse.move(0, 0);
  await expect(feed).toHaveScreenshot("masonry-5-columns.png", {
    animations: "disabled",
  });
});

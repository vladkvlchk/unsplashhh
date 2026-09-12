import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import type { ComponentProps, ImgHTMLAttributes } from "react";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { PhotoFeed } from "@/components/gallery/PhotoFeed";
import { PAGE_PARAM } from "@/constants/search-params";
import { COLUMNS_COOKIE_NAME } from "@/constants/storage";
import { makePhotosPage } from "@/test-utils/fixtures";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(window.location.search),
  usePathname: () => window.location.pathname,
}));

vi.mock("next/image", () => ({
  default: ({
    priority,
    ...props
  }: ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => (
    <img {...props} />
  ),
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: ComponentProps<"a">) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const requestedPages: number[] = [];

const server = setupServer(
  http.get("*/api/photos", ({ request }) => {
    const page = Number(
      new URL(request.url).searchParams.get(PAGE_PARAM) ?? "1",
    );
    requestedPages.push(page);

    return HttpResponse.json(makePhotosPage(page));
  }),
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

beforeEach(() => {
  requestedPages.length = 0;
  window.history.replaceState(null, "", "/");
  document.cookie = `${COLUMNS_COOKIE_NAME}=; path=/; max-age=0`;
});

afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderFeed(props: Partial<ComponentProps<typeof PhotoFeed>> = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <PhotoFeed source={{ kind: "editorial" }} initialColumns={3} {...props} />
    </QueryClientProvider>,
  );
}

describe("PhotoFeed", () => {
  it("shows a skeleton first, then the photos and pagination", async () => {
    renderFeed();

    expect(document.querySelector("ul[aria-hidden='true']")).toBeInTheDocument();

    expect(await screen.findByAltText("Alt for p1-0")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(8);

    const pagination = screen.getByRole("navigation", { name: "Pagination" });
    expect(
      within(pagination).getByRole("link", { current: "page" }),
    ).toHaveTextContent("1");
  });

  it("prefetches the next page in the background", async () => {
    renderFeed();

    await screen.findByAltText("Alt for p1-0");

    await waitFor(() => expect(requestedPages).toContain(2));
  });

  it("shows an error state and recovers on retry", async () => {
    server.use(
      http.get(
        "*/api/photos",
        () => HttpResponse.json({ message: "boom" }, { status: 500 }),
        { once: true },
      ),
    );

    renderFeed();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Something went wrong while loading photos.",
    );

    await userEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByAltText("Alt for p1-0")).toBeInTheDocument();
  });

  it("explains rate limiting instead of a generic error", async () => {
    server.use(
      http.get("*/api/photos", () =>
        HttpResponse.json({ message: "Rate Limit Exceeded" }, { status: 403 }),
      ),
    );

    renderFeed();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "The Unsplash API hourly limit has been reached. Please try again in a few minutes.",
    );
  });

  it("shows the empty message when there are no results", async () => {
    server.use(
      http.get("*/api/photos", () =>
        HttpResponse.json({ photos: [], totalPages: 0, total: 0 }),
      ),
    );

    renderFeed({ emptyMessage: "Nothing found here" });

    expect(await screen.findByText("Nothing found here")).toBeInTheDocument();
  });

  it("switches columns and persists the choice in a cookie", async () => {
    renderFeed();

    await screen.findByAltText("Alt for p1-0");

    const fiveColumns = screen.getByRole("button", { name: "5 columns" });
    await userEvent.click(fiveColumns);

    expect(fiveColumns).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "3 columns" }),
    ).toHaveAttribute("aria-pressed", "false");
    expect(document.cookie).toContain(`${COLUMNS_COOKIE_NAME}=5`);
  });

  it("updates the url when another page is selected", async () => {
    renderFeed();

    await screen.findByAltText("Alt for p1-0");

    const pagination = screen.getByRole("navigation", { name: "Pagination" });
    await userEvent.click(
      within(pagination).getByRole("link", { name: /^2$/ }),
    );

    expect(window.location.search).toBe(`?${PAGE_PARAM}=2`);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 });
  });
});

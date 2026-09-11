import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { PHOTOS_PER_PAGE, UNSPLASH_API_URL } from "@/constants/api";
import { getPhoto, getPhotos, searchPhotos } from "@/lib/unsplash/api";
import { isNotFoundError, UnsplashApiError } from "@/lib/unsplash/errors";

const TEST_ACCESS_KEY = "test-access-key";

const rawUser = {
  id: "u1",
  name: "Ann Author",
  username: "ann",
  bio: "A very long bio that the UI never needs",
  location: "Kyiv",
  links: { self: "...", html: "...", photos: "..." },
  profile_image: {
    small: "https://images.unsplash.com/profile-1?w=32&h=32",
    medium: "https://images.unsplash.com/profile-1?w=64&h=64",
    large: "https://images.unsplash.com/profile-1?w=128&h=128",
  },
  total_collections: 5,
  total_likes: 100,
  total_photos: 250,
};

const rawPhoto = {
  id: "raw-1",
  slug: "raw-1-slug",
  width: 4000,
  height: 6000,
  color: "#0c0c26",
  blur_hash: "LKO2?U%2Tw=w]~RBVZRi};RPxuwH",
  description: "A photo",
  alt_description: "Alt text",
  created_at: "2026-05-01T10:00:00Z",
  updated_at: "2026-05-02T10:00:00Z",
  promoted_at: null,
  likes: 42,
  liked_by_user: false,
  urls: {
    raw: "https://images.unsplash.com/photo-raw-1?ixid=x",
    full: "https://images.unsplash.com/photo-raw-1?ixid=x&q=85",
    regular: "https://images.unsplash.com/photo-raw-1?ixid=x&w=1080",
    small: "https://images.unsplash.com/photo-raw-1?ixid=x&w=400",
    thumb: "https://images.unsplash.com/photo-raw-1?ixid=x&w=200",
  },
  links: { self: "...", html: "...", download: "...", download_location: "..." },
  current_user_collections: [],
  sponsorship: null,
  topic_submissions: { wallpapers: { status: "approved" } },
  user: rawUser,
};

const trimmedPhoto = {
  id: "raw-1",
  width: 4000,
  height: 6000,
  color: "#0c0c26",
  description: "A photo",
  alt_description: "Alt text",
  created_at: "2026-05-01T10:00:00Z",
  likes: 42,
  urls: {
    raw: "https://images.unsplash.com/photo-raw-1?ixid=x",
    regular: "https://images.unsplash.com/photo-raw-1?ixid=x&w=1080",
  },
  user: {
    name: "Ann Author",
    username: "ann",
    profile_image: {
      medium: "https://images.unsplash.com/profile-1?w=64&h=64",
    },
  },
};

const server = setupServer();

beforeAll(() => {
  vi.stubEnv("UNSPLASH_ACCESS_KEY", TEST_ACCESS_KEY);
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => server.resetHandlers());

afterAll(() => {
  vi.unstubAllEnvs();
  server.close();
});

describe("getPhotos", () => {
  it("sends credentials, versioning and pagination params", async () => {
    let capturedRequest: Request | undefined;

    server.use(
      http.get(`${UNSPLASH_API_URL}/photos`, ({ request }) => {
        capturedRequest = request;

        return HttpResponse.json([rawPhoto], { headers: { "X-Total": "90" } });
      }),
    );

    await getPhotos(2);

    const url = new URL(capturedRequest!.url);
    expect(capturedRequest!.headers.get("authorization")).toBe(
      `Client-ID ${TEST_ACCESS_KEY}`,
    );
    expect(capturedRequest!.headers.get("accept-version")).toBe("v1");
    expect(url.searchParams.get("page")).toBe("2");
    expect(url.searchParams.get("per_page")).toBe(String(PHOTOS_PER_PAGE));
  });

  it("trims raw photos down to exactly the fields the ui consumes", async () => {
    server.use(
      http.get(`${UNSPLASH_API_URL}/photos`, () =>
        HttpResponse.json([rawPhoto], { headers: { "X-Total": "90" } }),
      ),
    );

    const { photos, totalPages, total } = await getPhotos(1);

    expect(photos).toEqual([trimmedPhoto]);
    expect(total).toBe(90);
    expect(totalPages).toBe(Math.ceil(90 / PHOTOS_PER_PAGE));
  });

  it("estimates pagination when the total header is missing", async () => {
    const fullPage = Array.from({ length: PHOTOS_PER_PAGE }, (_, index) => ({
      ...rawPhoto,
      id: `raw-${index}`,
    }));

    server.use(
      http.get(`${UNSPLASH_API_URL}/photos`, () =>
        HttpResponse.json(fullPage),
      ),
    );
    expect((await getPhotos(3)).totalPages).toBe(4);

    server.use(
      http.get(`${UNSPLASH_API_URL}/photos`, () =>
        HttpResponse.json([rawPhoto]),
      ),
    );
    expect((await getPhotos(3)).totalPages).toBe(3);
  });

  it("throws a typed error for failed responses", async () => {
    server.use(
      http.get(`${UNSPLASH_API_URL}/photos`, () =>
        HttpResponse.text("Rate Limit Exceeded", { status: 403 }),
      ),
    );

    const request = getPhotos(1);

    await expect(request).rejects.toBeInstanceOf(UnsplashApiError);
    await expect(request).rejects.toMatchObject({ status: 403 });
  });
});

describe("getPhoto", () => {
  it("trims photo details, tags and location", async () => {
    server.use(
      http.get(`${UNSPLASH_API_URL}/photos/raw-1`, () =>
        HttpResponse.json({
          ...rawPhoto,
          downloads: 1234,
          views: 56789,
          exif: { make: "Canon", model: "EOS R5" },
          location: {
            name: "Carpathians, Ukraine",
            city: null,
            country: "Ukraine",
            position: { latitude: 48.15, longitude: 24.5 },
          },
          tags: [
            {
              type: "search",
              title: "mountains",
              source: { ancestry: { type: { slug: "images" } } },
            },
            { type: "landing_page", title: "nature" },
          ],
        }),
      ),
    );

    const photo = await getPhoto("raw-1");

    expect(photo).toEqual({
      ...trimmedPhoto,
      downloads: 1234,
      views: 56789,
      location: { name: "Carpathians, Ukraine" },
      tags: [
        { type: "search", title: "mountains" },
        { type: "landing_page", title: "nature" },
      ],
    });
  });

  it("drops a location without a name and defaults missing tags", async () => {
    server.use(
      http.get(`${UNSPLASH_API_URL}/photos/raw-1`, () =>
        HttpResponse.json({
          ...rawPhoto,
          location: { name: null, city: null },
        }),
      ),
    );

    const photo = await getPhoto("raw-1");

    expect(photo.location).toBeUndefined();
    expect(photo.tags).toEqual([]);
  });

  it("surfaces missing photos as a not-found error", async () => {
    server.use(
      http.get(`${UNSPLASH_API_URL}/photos/missing`, () =>
        HttpResponse.json({ errors: ["Couldn't find Photo"] }, { status: 404 }),
      ),
    );

    const error = await getPhoto("missing").catch(
      (caught: unknown) => caught,
    );

    expect(error).toBeInstanceOf(UnsplashApiError);
    expect(isNotFoundError(error)).toBe(true);
  });
});

describe("searchPhotos", () => {
  it("passes the query and maps the search response shape", async () => {
    let capturedUrl: URL | undefined;

    server.use(
      http.get(`${UNSPLASH_API_URL}/search/photos`, ({ request }) => {
        capturedUrl = new URL(request.url);

        return HttpResponse.json({
          total: 133,
          total_pages: 5,
          results: [rawPhoto],
        });
      }),
    );

    const result = await searchPhotos("carpathian mountains", 4);

    expect(capturedUrl!.searchParams.get("query")).toBe(
      "carpathian mountains",
    );
    expect(capturedUrl!.searchParams.get("page")).toBe("4");
    expect(result).toEqual({
      photos: [trimmedPhoto],
      totalPages: 5,
      total: 133,
    });
  });
});

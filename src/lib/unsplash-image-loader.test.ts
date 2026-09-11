import { describe, expect, it } from "vitest";

import { DEFAULT_IMAGE_QUALITY } from "@/constants/api";
import unsplashImageLoader from "@/lib/unsplash-image-loader";

const PHOTO_SRC = "https://images.unsplash.com/photo-123?ixid=abc&ixlib=rb-4.1.0";
const AVATAR_SRC = "https://images.unsplash.com/profile-123?w=64&h=64&fit=crop";

describe("unsplashImageLoader", () => {
  it("appends width, quality and format params to the CDN url", () => {
    const url = new URL(unsplashImageLoader({ src: PHOTO_SRC, width: 640 }));

    expect(url.searchParams.get("w")).toBe("640");
    expect(url.searchParams.get("q")).toBe(String(DEFAULT_IMAGE_QUALITY));
    expect(url.searchParams.get("auto")).toBe("format");
    expect(url.searchParams.get("fit")).toBe("max");
  });

  it("preserves existing tracking params", () => {
    const url = new URL(unsplashImageLoader({ src: PHOTO_SRC, width: 640 }));

    expect(url.searchParams.get("ixid")).toBe("abc");
    expect(url.searchParams.get("ixlib")).toBe("rb-4.1.0");
  });

  it("overrides a width already present in the url", () => {
    const url = new URL(
      unsplashImageLoader({ src: `${PHOTO_SRC}&w=1080`, width: 320 }),
    );

    expect(url.searchParams.get("w")).toBe("320");
  });

  it("uses the requested quality when provided", () => {
    const url = new URL(
      unsplashImageLoader({ src: PHOTO_SRC, width: 640, quality: 90 }),
    );

    expect(url.searchParams.get("q")).toBe("90");
  });

  it("keeps square avatars square by syncing height with width", () => {
    const url = new URL(unsplashImageLoader({ src: AVATAR_SRC, width: 32 }));

    expect(url.searchParams.get("w")).toBe("32");
    expect(url.searchParams.get("h")).toBe("32");
  });

  it("does not add a height to photos that have none", () => {
    const url = new URL(unsplashImageLoader({ src: PHOTO_SRC, width: 640 }));

    expect(url.searchParams.has("h")).toBe(false);
  });
});

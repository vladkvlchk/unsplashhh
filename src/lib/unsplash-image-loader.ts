"use client";

import type { ImageLoaderProps } from "next/image";

import { DEFAULT_IMAGE_QUALITY } from "@/constants/api";

export default function unsplashImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  const url = new URL(src);

  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? DEFAULT_IMAGE_QUALITY));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");

  if (url.searchParams.has("h")) {
    url.searchParams.set("h", String(width));
  }

  return url.toString();
}

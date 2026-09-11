import "server-only";

import {
  API_REVALIDATE_SECONDS,
  PHOTOS_PER_PAGE,
  UNSPLASH_API_URL,
} from "@/constants/api";
import { UnsplashApiError } from "@/lib/unsplash/errors";
import type {
  PhotosPage,
  UnsplashPhoto,
  UnsplashPhotoDetails,
  UnsplashSearchResponse,
} from "@/types/unsplash";

function getAccessKey(): string {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    throw new Error("Missing UNSPLASH_ACCESS_KEY environment variable");
  }

  return accessKey;
}

async function unsplashFetch<T>(
  path: string,
  params: Record<string, string> = {},
): Promise<{ data: T; headers: Headers }> {
  const url = new URL(path, UNSPLASH_API_URL);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${getAccessKey()}`,
      "Accept-Version": "v1",
    },
    cache: "force-cache",
    next: { revalidate: API_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new UnsplashApiError(
      response.status,
      `Unsplash API request to ${path} failed with status ${response.status}`,
    );
  }

  return { data: (await response.json()) as T, headers: response.headers };
}

function toPhoto(raw: UnsplashPhoto): UnsplashPhoto {
  return {
    id: raw.id,
    width: raw.width,
    height: raw.height,
    color: raw.color,
    description: raw.description,
    alt_description: raw.alt_description,
    created_at: raw.created_at,
    likes: raw.likes,
    urls: {
      raw: raw.urls.raw,
      regular: raw.urls.regular,
    },
    user: {
      name: raw.user.name,
      username: raw.user.username,
      profile_image: {
        medium: raw.user.profile_image.medium,
      },
    },
  };
}

function toPhotoDetails(raw: UnsplashPhotoDetails): UnsplashPhotoDetails {
  return {
    ...toPhoto(raw),
    tags: (raw.tags ?? []).map((tag) => ({ type: tag.type, title: tag.title })),
    downloads: raw.downloads,
    views: raw.views,
    location: raw.location?.name ? { name: raw.location.name } : undefined,
  };
}

export async function getPhotos(page: number): Promise<PhotosPage> {
  const { data, headers } = await unsplashFetch<UnsplashPhoto[]>("/photos", {
    page: String(page),
    per_page: String(PHOTOS_PER_PAGE),
  });

  const total = Number(headers.get("x-total")) || 0;
  const totalPages = total
    ? Math.ceil(total / PHOTOS_PER_PAGE)
    : data.length === PHOTOS_PER_PAGE
      ? page + 1
      : page;

  return { photos: data.map(toPhoto), totalPages, total };
}

export async function getPhoto(id: string): Promise<UnsplashPhotoDetails> {
  const { data } = await unsplashFetch<UnsplashPhotoDetails>(`/photos/${id}`);

  return toPhotoDetails(data);
}

export async function searchPhotos(
  query: string,
  page: number,
): Promise<PhotosPage> {
  const { data } = await unsplashFetch<UnsplashSearchResponse>(
    "/search/photos",
    {
      query,
      page: String(page),
      per_page: String(PHOTOS_PER_PAGE),
    },
  );

  return {
    photos: data.results.map(toPhoto),
    totalPages: data.total_pages,
    total: data.total,
  };
}

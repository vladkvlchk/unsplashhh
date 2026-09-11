import { PHOTOS_PER_PAGE } from "@/constants/api";
import type { PhotosPage, UnsplashPhoto } from "@/types/unsplash";

export function makePhoto(
  id: string,
  overrides: Partial<UnsplashPhoto> = {},
): UnsplashPhoto {
  return {
    id,
    width: 1000,
    height: 1500,
    color: "#262626",
    description: `Photo ${id}`,
    alt_description: `Alt for ${id}`,
    created_at: "2026-01-01T00:00:00Z",
    likes: 10,
    urls: {
      raw: `https://images.unsplash.com/photo-${id}?ixid=test`,
      regular: `https://images.unsplash.com/photo-${id}?ixid=test&w=1080`,
    },
    user: {
      name: `Author ${id}`,
      username: `author-${id}`,
      profile_image: {
        medium: `https://images.unsplash.com/profile-${id}?w=32&h=32`,
      },
    },
    ...overrides,
  };
}

export function makePhotosPage(
  page: number,
  count = 8,
  totalPages = 5,
): PhotosPage {
  return {
    photos: Array.from({ length: count }, (_, index) =>
      makePhoto(`p${page}-${index}`),
    ),
    totalPages,
    total: totalPages * PHOTOS_PER_PAGE,
  };
}

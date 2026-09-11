import { QUERY_KEYS } from "@/constants/query";
import { fetchPhotosPage, fetchSearchPage } from "@/lib/unsplash/client";
import type { PhotosPage } from "@/types/unsplash";

export type FeedSource =
  | { kind: "editorial" }
  | { kind: "search"; query: string };

export function getFeedQueryKey(source: FeedSource, page: number) {
  return source.kind === "editorial"
    ? QUERY_KEYS.photos(page)
    : QUERY_KEYS.search(source.query, page);
}

export function fetchFeedPage(
  source: FeedSource,
  page: number,
): Promise<PhotosPage> {
  return source.kind === "editorial"
    ? fetchPhotosPage(page)
    : fetchSearchPage(source.query, page);
}

import "server-only";

import { QueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants/query";
import { searchPhotos } from "@/lib/unsplash/api";
import type { PhotosPage } from "@/types/unsplash";

export async function prefetchSearchFeed(query: string, page: number) {
  const queryClient = new QueryClient();

  await queryClient
    .query({
      queryKey: QUERY_KEYS.search(query, page),
      queryFn: () => searchPhotos(query, page),
    })
    .catch(() => undefined);

  return {
    queryClient,
    results: queryClient.getQueryData<PhotosPage>(
      QUERY_KEYS.search(query, page),
    ),
  };
}

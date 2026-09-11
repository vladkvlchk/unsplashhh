export const QUERY_STALE_TIME_MS = 5 * 60 * 1000;
export const QUERY_GC_TIME_MS = 30 * 60 * 1000;
export const QUERY_RETRY_COUNT = 1;

export const QUERY_KEYS = {
  photos: (page: number) => ["photos", page] as const,
  search: (query: string, page: number) => ["search", query, page] as const,
  collection: () => ["collection"] as const,
};

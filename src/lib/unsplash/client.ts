import { API_ROUTES } from "@/constants/routes";
import { PAGE_PARAM, QUERY_PARAM } from "@/constants/search-params";
import type { PhotosPage } from "@/types/unsplash";

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new HttpError(
      response.status,
      `Request to ${url} failed with status ${response.status}`,
    );
  }

  return response.json() as Promise<T>;
}

export function fetchPhotosPage(page: number): Promise<PhotosPage> {
  const params = new URLSearchParams({ [PAGE_PARAM]: String(page) });

  return fetchJson(`${API_ROUTES.photos}?${params}`);
}

export function fetchSearchPage(
  query: string,
  page: number,
): Promise<PhotosPage> {
  const params = new URLSearchParams({
    [QUERY_PARAM]: query,
    [PAGE_PARAM]: String(page),
  });

  return fetchJson(`${API_ROUTES.search}?${params}`);
}

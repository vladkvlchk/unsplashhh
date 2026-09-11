export const ROUTES = {
  home: "/",
  photo: (id: string) => `/photos/${id}`,
  search: "/search",
  tag: (tag: string) => `/t/${encodeURIComponent(tag)}`,
  register: "/register",
  profile: "/profile",
} as const;

export const API_ROUTES = {
  photos: "/api/photos",
  search: "/api/search",
} as const;

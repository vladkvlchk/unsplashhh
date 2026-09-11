import { COOKIE_MAX_AGE_SECONDS } from "@/constants/storage";

export function setClientCookie(name: string, value: string): void {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
}

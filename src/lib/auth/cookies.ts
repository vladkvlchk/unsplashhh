import "server-only";

import { COOKIE_MAX_AGE_SECONDS } from "@/constants/storage";

export function httpOnlyCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  };
}

import "server-only";

import { cookies } from "next/headers";
import { z } from "zod";

import { SESSION_COOKIE_NAME } from "@/constants/storage";
import type { SessionUser } from "@/types/auth";

const sessionSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
});

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const rawSession = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!rawSession) {
    return null;
  }

  try {
    return sessionSchema.parse(JSON.parse(rawSession));
  } catch {
    return null;
  }
}

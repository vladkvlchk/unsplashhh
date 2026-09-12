import "server-only";

import { cookies } from "next/headers";
import { z } from "zod";

import {
  USERS_COOKIE_MAX_BYTES,
  USERS_COOKIE_NAME,
} from "@/constants/storage";
import { httpOnlyCookieOptions } from "@/lib/auth/cookies";

const storedUserSchema = z.object({
  email: z.email(),
  name: z.string().min(1),
  salt: z.string().min(1),
  passwordHash: z.string().min(1),
});

const usersSchema = z.array(storedUserSchema);

export type StoredUser = z.infer<typeof storedUserSchema>;

export async function readUsers(): Promise<StoredUser[]> {
  const cookieStore = await cookies();
  const rawUsers = cookieStore.get(USERS_COOKIE_NAME)?.value;

  if (!rawUsers) {
    return [];
  }

  try {
    return usersSchema.parse(JSON.parse(rawUsers));
  } catch {
    return [];
  }
}

export async function persistUsers(users: StoredUser[]): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(
    USERS_COOKIE_NAME,
    JSON.stringify(users),
    httpOnlyCookieOptions(),
  );
}

export async function findUserByEmail(
  email: string,
): Promise<StoredUser | undefined> {
  const users = await readUsers();

  return users.find((user) => user.email === email);
}

export function usersFitCookie(users: StoredUser[]): boolean {
  const cookie = `${USERS_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(users))}`;

  return cookie.length <= USERS_COOKIE_MAX_BYTES;
}

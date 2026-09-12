import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

import {
  PASSWORD_KEY_LENGTH,
  PASSWORD_SALT_BYTES,
} from "@/constants/auth";

export function createSalt(): string {
  return randomBytes(PASSWORD_SALT_BYTES).toString("hex");
}

export function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, PASSWORD_KEY_LENGTH).toString("hex");
}

export function verifyPassword(
  password: string,
  salt: string,
  expectedHash: string,
): boolean {
  const actual = Buffer.from(hashPassword(password, salt));
  const expected = Buffer.from(expectedHash);

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

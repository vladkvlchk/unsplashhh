import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

import { PASSWORD_KEY_LENGTH, PASSWORD_SALT_BYTES } from "@/constants/auth";

const scrypt = promisify(scryptCallback);

export function createSalt(): string {
  return randomBytes(PASSWORD_SALT_BYTES).toString("hex");
}

export async function hashPassword(
  password: string,
  salt: string,
): Promise<string> {
  const derivedKey = (await scrypt(
    password,
    salt,
    PASSWORD_KEY_LENGTH,
  )) as Buffer;

  return derivedKey.toString("hex");
}

export async function verifyPassword(
  password: string,
  salt: string,
  expectedHash: string,
): Promise<boolean> {
  const actual = Buffer.from(await hashPassword(password, salt));
  const expected = Buffer.from(expectedHash);

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

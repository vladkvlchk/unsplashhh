import { describe, expect, it } from "vitest";

import { PASSWORD_KEY_LENGTH, PASSWORD_SALT_BYTES } from "@/constants/auth";
import {
  createSalt,
  hashPassword,
  verifyPassword,
} from "@/lib/auth/passwords";

describe("passwords", () => {
  it("creates unique salts of the configured length", () => {
    const first = createSalt();
    const second = createSalt();

    expect(first).toHaveLength(PASSWORD_SALT_BYTES * 2);
    expect(first).not.toBe(second);
  });

  it("hashes deterministically for the same salt", () => {
    const salt = createSalt();

    expect(hashPassword("secret", salt)).toBe(hashPassword("secret", salt));
    expect(hashPassword("secret", salt)).toHaveLength(PASSWORD_KEY_LENGTH * 2);
  });

  it("produces different hashes for different salts", () => {
    expect(hashPassword("secret", createSalt())).not.toBe(
      hashPassword("secret", createSalt()),
    );
  });

  it("verifies a correct password and rejects a wrong one", () => {
    const salt = createSalt();
    const hash = hashPassword("correct horse", salt);

    expect(verifyPassword("correct horse", salt, hash)).toBe(true);
    expect(verifyPassword("wrong horse", salt, hash)).toBe(false);
    expect(verifyPassword("correct horse", salt, "not-a-hash")).toBe(false);
  });
});

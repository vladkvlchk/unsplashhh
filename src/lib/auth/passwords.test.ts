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

  it("hashes deterministically for the same salt", async () => {
    const salt = createSalt();
    const hash = await hashPassword("secret", salt);

    expect(hash).toBe(await hashPassword("secret", salt));
    expect(hash).toHaveLength(PASSWORD_KEY_LENGTH * 2);
  });

  it("produces different hashes for different salts", async () => {
    expect(await hashPassword("secret", createSalt())).not.toBe(
      await hashPassword("secret", createSalt()),
    );
  });

  it("verifies a correct password and rejects a wrong one", async () => {
    const salt = createSalt();
    const hash = await hashPassword("correct horse", salt);

    expect(await verifyPassword("correct horse", salt, hash)).toBe(true);
    expect(await verifyPassword("wrong horse", salt, hash)).toBe(false);
    expect(await verifyPassword("correct horse", salt, "not-a-hash")).toBe(
      false,
    );
  });
});

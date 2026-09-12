import { describe, expect, it } from "vitest";

import { USERS_COOKIE_MAX_BYTES } from "@/constants/storage";
import { type StoredUser, usersFitCookie } from "@/lib/auth/users";

function makeStoredUser(index: number): StoredUser {
  return {
    email: `user-${index}@example.com`,
    name: `User ${index}`,
    salt: "a".repeat(32),
    passwordHash: "b".repeat(128),
  };
}

describe("usersFitCookie", () => {
  it("accepts a store that fits into the cookie limit", () => {
    expect(usersFitCookie([makeStoredUser(1)])).toBe(true);
  });

  it("rejects a store that would overflow the cookie", () => {
    const tooMany = Array.from({ length: 20 }, (_, index) =>
      makeStoredUser(index),
    );

    expect(JSON.stringify(tooMany).length).toBeGreaterThan(
      USERS_COOKIE_MAX_BYTES,
    );
    expect(usersFitCookie(tooMany)).toBe(false);
  });
});

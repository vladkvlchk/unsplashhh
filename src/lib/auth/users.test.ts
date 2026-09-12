import { describe, expect, it } from "vitest";

import { type StoredUser, usersFitCookie } from "@/lib/auth/users";

function makeStoredUser(index: number, name?: string): StoredUser {
  const paddedIndex = String(index).padStart(2, "0");

  return {
    email: `user-${paddedIndex}@example.com`,
    name: name ?? `User ${paddedIndex}`,
    salt: "a".repeat(32),
    passwordHash: "b".repeat(128),
  };
}

function makeStoredUsers(count: number, makeName?: (index: number) => string) {
  return Array.from({ length: count }, (_, index) =>
    makeStoredUser(index, makeName?.(index)),
  );
}

describe("usersFitCookie", () => {
  it("accepts as many realistic users as the encoded browser limit allows", () => {
    expect(usersFitCookie(makeStoredUsers(13))).toBe(true);
    expect(usersFitCookie(makeStoredUsers(14))).toBe(false);
  });

  it("accounts for multi-byte names inflating the encoded size", () => {
    const cyrillicName = (index: number) =>
      `Користувач ${String(index).padStart(2, "0")}`;

    expect(usersFitCookie(makeStoredUsers(11, cyrillicName))).toBe(true);
    expect(usersFitCookie(makeStoredUsers(12, cyrillicName))).toBe(false);
  });
});

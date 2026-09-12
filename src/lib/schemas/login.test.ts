import { describe, expect, it } from "vitest";

import { loginFormSchema } from "@/lib/schemas/login";

describe("loginFormSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginFormSchema.safeParse({
      email: "vlad@example.com",
      password: "supersecret1",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = loginFormSchema.safeParse({
      email: "not-an-email",
      password: "supersecret1",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      "Enter a valid email address",
    );
  });

  it("rejects an empty password", () => {
    const result = loginFormSchema.safeParse({
      email: "vlad@example.com",
      password: "",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Enter your password");
  });
});

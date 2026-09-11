import { describe, expect, it } from "vitest";

import { PASSWORD_MIN_LENGTH } from "@/constants/validation";
import { registerFormSchema } from "@/lib/schemas/register";

const validValues = {
  name: "Vlad",
  email: "vlad@example.com",
  password: "supersecret1",
  confirmPassword: "supersecret1",
};

describe("registerFormSchema", () => {
  it("accepts valid registration data and trims the name", () => {
    const result = registerFormSchema.safeParse({
      ...validValues,
      name: "  Vlad  ",
    });

    expect(result.success).toBe(true);
    expect(result.data?.name).toBe("Vlad");
  });

  it("rejects a too short name", () => {
    expect(
      registerFormSchema.safeParse({ ...validValues, name: "V" }).success,
    ).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(
      registerFormSchema.safeParse({ ...validValues, email: "not-an-email" })
        .success,
    ).toBe(false);
  });

  it("rejects a too short password with a helpful message", () => {
    const result = registerFormSchema.safeParse({
      ...validValues,
      password: "1234567",
      confirmPassword: "1234567",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    );
  });

  it("rejects mismatched passwords on the confirmPassword field", () => {
    const result = registerFormSchema.safeParse({
      ...validValues,
      confirmPassword: "different-pass",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["confirmPassword"]);
    expect(result.error?.issues[0]?.message).toBe("Passwords do not match");
  });
});

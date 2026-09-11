import { describe, expect, it } from "vitest";

import { SEARCH_QUERY_MAX_LENGTH } from "@/constants/validation";
import { searchFormSchema } from "@/lib/schemas/search";

describe("searchFormSchema", () => {
  it("accepts a normal query and trims it", () => {
    const result = searchFormSchema.safeParse({ query: "  mountains  " });

    expect(result.success).toBe(true);
    expect(result.data?.query).toBe("mountains");
  });

  it("rejects empty and whitespace-only queries", () => {
    expect(searchFormSchema.safeParse({ query: "" }).success).toBe(false);
    expect(searchFormSchema.safeParse({ query: "   " }).success).toBe(false);
    expect(searchFormSchema.safeParse({}).success).toBe(false);
  });

  it("rejects queries above the length limit", () => {
    const tooLong = "a".repeat(SEARCH_QUERY_MAX_LENGTH + 1);

    expect(searchFormSchema.safeParse({ query: tooLong }).success).toBe(false);
    expect(
      searchFormSchema.safeParse({ query: "a".repeat(SEARCH_QUERY_MAX_LENGTH) })
        .success,
    ).toBe(true);
  });
});

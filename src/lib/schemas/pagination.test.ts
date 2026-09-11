import { describe, expect, it } from "vitest";

import { DEFAULT_PAGE } from "@/constants/api";
import { parsePageParam } from "@/lib/schemas/pagination";

describe("parsePageParam", () => {
  it("parses valid numeric strings", () => {
    expect(parsePageParam("5")).toBe(5);
    expect(parsePageParam("1")).toBe(1);
  });

  it("falls back to the default page for missing values", () => {
    expect(parsePageParam(undefined)).toBe(DEFAULT_PAGE);
    expect(parsePageParam(null)).toBe(DEFAULT_PAGE);
    expect(parsePageParam("")).toBe(DEFAULT_PAGE);
  });

  it("falls back for non-numeric input", () => {
    expect(parsePageParam("abc")).toBe(DEFAULT_PAGE);
    expect(parsePageParam("12abc")).toBe(DEFAULT_PAGE);
  });

  it("falls back for zero, negative and fractional pages", () => {
    expect(parsePageParam("0")).toBe(DEFAULT_PAGE);
    expect(parsePageParam("-3")).toBe(DEFAULT_PAGE);
    expect(parsePageParam("2.5")).toBe(DEFAULT_PAGE);
  });

  it("handles repeated query params the way URLSearchParams delivers them", () => {
    expect(parsePageParam(["3"])).toBe(3);
    expect(parsePageParam(["1", "2"])).toBe(DEFAULT_PAGE);
  });
});

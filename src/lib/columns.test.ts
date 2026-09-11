import { describe, expect, it } from "vitest";

import { DEFAULT_COLUMN_COUNT } from "@/constants/layout";
import { parseColumnCount } from "@/lib/columns";

describe("parseColumnCount", () => {
  it("parses supported column counts", () => {
    expect(parseColumnCount("3")).toBe(3);
    expect(parseColumnCount("5")).toBe(5);
  });

  it("falls back to the default for unsupported counts", () => {
    expect(parseColumnCount("4")).toBe(DEFAULT_COLUMN_COUNT);
    expect(parseColumnCount("0")).toBe(DEFAULT_COLUMN_COUNT);
    expect(parseColumnCount("-5")).toBe(DEFAULT_COLUMN_COUNT);
  });

  it("falls back for missing or malformed cookies", () => {
    expect(parseColumnCount(undefined)).toBe(DEFAULT_COLUMN_COUNT);
    expect(parseColumnCount("")).toBe(DEFAULT_COLUMN_COUNT);
    expect(parseColumnCount("abc")).toBe(DEFAULT_COLUMN_COUNT);
  });
});

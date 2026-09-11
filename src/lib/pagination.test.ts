import { describe, expect, it } from "vitest";

import { PAGINATION_ELLIPSIS } from "@/constants/pagination";
import { getPaginationRange } from "@/lib/pagination";

describe("getPaginationRange", () => {
  it("returns every page when the total fits in the window", () => {
    expect(getPaginationRange(1, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(getPaginationRange(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("returns a single page for one-page feeds", () => {
    expect(getPaginationRange(1, 1)).toEqual([1]);
  });

  it("collapses only the right side near the start", () => {
    expect(getPaginationRange(1, 20)).toEqual([
      1,
      2,
      3,
      4,
      5,
      PAGINATION_ELLIPSIS,
      20,
    ]);
    expect(getPaginationRange(3, 20)).toEqual([
      1,
      2,
      3,
      4,
      5,
      PAGINATION_ELLIPSIS,
      20,
    ]);
  });

  it("collapses only the left side near the end", () => {
    expect(getPaginationRange(19, 20)).toEqual([
      1,
      PAGINATION_ELLIPSIS,
      16,
      17,
      18,
      19,
      20,
    ]);
  });

  it("collapses both sides in the middle", () => {
    expect(getPaginationRange(10, 20)).toEqual([
      1,
      PAGINATION_ELLIPSIS,
      9,
      10,
      11,
      PAGINATION_ELLIPSIS,
      20,
    ]);
  });

  it("starts collapsing the left side right after the boundary", () => {
    expect(getPaginationRange(4, 20)).toEqual([
      1,
      PAGINATION_ELLIPSIS,
      3,
      4,
      5,
      PAGINATION_ELLIPSIS,
      20,
    ]);
  });

  it("respects a custom sibling count", () => {
    expect(getPaginationRange(10, 20, 2)).toEqual([
      1,
      PAGINATION_ELLIPSIS,
      8,
      9,
      10,
      11,
      12,
      PAGINATION_ELLIPSIS,
      20,
    ]);
  });
});

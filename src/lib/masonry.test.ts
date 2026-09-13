import { describe, expect, it } from "vitest";

import { distributeIntoColumns } from "@/lib/masonry";

function item(id: number, width: number, height: number) {
  return { id, width, height };
}

describe("distributeIntoColumns", () => {
  it("always yields the requested number of columns", () => {
    expect(distributeIntoColumns([], 3)).toEqual([[], [], []]);
    expect(distributeIntoColumns([item(1, 100, 100)], 3)).toEqual([
      [item(1, 100, 100)],
      [],
      [],
    ]);
  });

  it("fills the top row left to right before stacking", () => {
    const photos = [
      item(1, 100, 100),
      item(2, 100, 100),
      item(3, 100, 100),
      item(4, 100, 100),
    ];

    const columns = distributeIntoColumns(photos, 3);

    expect(columns.map((column) => column.map((photo) => photo.id))).toEqual([
      [1, 4],
      [2],
      [3],
    ]);
  });

  it("places the next photo into the shortest column", () => {
    const photos = [
      item(1, 100, 300),
      item(2, 100, 100),
      item(3, 100, 100),
      item(4, 100, 100),
    ];

    const columns = distributeIntoColumns(photos, 2);

    expect(columns.map((column) => column.map((photo) => photo.id))).toEqual([
      [1],
      [2, 3, 4],
    ]);
  });

  it("keeps the original order within each column", () => {
    const photos = Array.from({ length: 12 }, (_, index) =>
      item(index, 100, 100 + (index % 4) * 50),
    );

    const columns = distributeIntoColumns(photos, 4);

    for (const column of columns) {
      const ids = column.map((photo) => photo.id);
      expect(ids).toEqual([...ids].sort((a, b) => a - b));
    }
  });

  it("is deterministic for the same input", () => {
    const photos = Array.from({ length: 30 }, (_, index) =>
      item(index, 1000, 600 + (index * 137) % 900),
    );

    expect(distributeIntoColumns(photos, 5)).toEqual(
      distributeIntoColumns(photos, 5),
    );
  });
});

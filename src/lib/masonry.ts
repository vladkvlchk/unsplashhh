interface SizedItem {
  width: number;
  height: number;
}

export function distributeIntoColumns<T extends SizedItem>(
  items: T[],
  columnCount: number,
): T[][] {
  const columns = Array.from({ length: columnCount }, () => ({
    items: [] as T[],
    height: 0,
  }));

  for (const item of items) {
    const shortest = columns.reduce((currentShortest, column) =>
      column.height < currentShortest.height ? column : currentShortest,
    );

    shortest.items.push(item);
    shortest.height += item.height / item.width;
  }

  return columns.map((column) => column.items);
}

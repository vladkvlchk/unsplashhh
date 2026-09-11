import {
  COLUMN_OPTIONS,
  type ColumnCount,
  DEFAULT_COLUMN_COUNT,
} from "@/constants/layout";

export function parseColumnCount(value: string | undefined): ColumnCount {
  const parsed = Number(value);

  return (COLUMN_OPTIONS as readonly number[]).includes(parsed)
    ? (parsed as ColumnCount)
    : DEFAULT_COLUMN_COUNT;
}

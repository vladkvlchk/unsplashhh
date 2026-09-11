import {
  PAGINATION_ELLIPSIS,
  PAGINATION_SIBLING_COUNT,
} from "@/constants/pagination";

export type PaginationItem = number | typeof PAGINATION_ELLIPSIS;

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number = PAGINATION_SIBLING_COUNT,
): PaginationItem[] {
  const totalVisible = siblingCount * 2 + 5;

  if (totalPages <= totalVisible) {
    return range(1, totalPages);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    return [
      ...range(1, siblingCount * 2 + 3),
      PAGINATION_ELLIPSIS,
      totalPages,
    ];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    return [
      1,
      PAGINATION_ELLIPSIS,
      ...range(totalPages - siblingCount * 2 - 2, totalPages),
    ];
  }

  return [
    1,
    PAGINATION_ELLIPSIS,
    ...range(leftSibling, rightSibling),
    PAGINATION_ELLIPSIS,
    totalPages,
  ];
}

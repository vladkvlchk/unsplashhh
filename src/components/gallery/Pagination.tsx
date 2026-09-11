"use client";

import clsx from "clsx";
import { usePathname, useSearchParams } from "next/navigation";
import type { MouseEvent } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons/icons";
import { PAGINATION_ELLIPSIS } from "@/constants/pagination";
import { PAGE_PARAM } from "@/constants/search-params";
import { getPaginationRange } from "@/lib/pagination";

import styles from "./Pagination.module.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const buildPageHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(PAGE_PARAM, String(page));

    return `${pathname}?${params.toString()}`;
  };

  const handleClick = (event: MouseEvent, page: number) => {
    event.preventDefault();
    onPageChange(page);
  };

  const items = getPaginationRange(currentPage, totalPages);

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <a
        className={clsx(styles.control, currentPage <= 1 && styles.disabled)}
        href={buildPageHref(currentPage - 1)}
        aria-disabled={currentPage <= 1}
        aria-label="Previous page"
        tabIndex={currentPage <= 1 ? -1 : undefined}
        onClick={(event) => handleClick(event, currentPage - 1)}
      >
        <ChevronLeftIcon />
      </a>
      {items.map((item, index) =>
        item === PAGINATION_ELLIPSIS ? (
          <span key={`${item}-${index}`} className={styles.ellipsis}>
            {PAGINATION_ELLIPSIS}
          </span>
        ) : (
          <a
            key={item}
            className={clsx(styles.control, item === currentPage && styles.active)}
            href={buildPageHref(item)}
            aria-current={item === currentPage ? "page" : undefined}
            onClick={(event) => handleClick(event, item)}
          >
            {item}
          </a>
        ),
      )}
      <a
        className={clsx(
          styles.control,
          currentPage >= totalPages && styles.disabled,
        )}
        href={buildPageHref(currentPage + 1)}
        aria-disabled={currentPage >= totalPages}
        aria-label="Next page"
        tabIndex={currentPage >= totalPages ? -1 : undefined}
        onClick={(event) => handleClick(event, currentPage + 1)}
      >
        <ChevronRightIcon />
      </a>
    </nav>
  );
}

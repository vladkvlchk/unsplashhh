"use client";

import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ColumnsToggle } from "@/components/gallery/ColumnsToggle";
import { Gallery } from "@/components/gallery/Gallery";
import { GallerySkeleton } from "@/components/gallery/GallerySkeleton";
import { Pagination } from "@/components/gallery/Pagination";
import { DEFAULT_PAGE } from "@/constants/api";
import { type ColumnCount } from "@/constants/layout";
import { PAGE_PARAM } from "@/constants/search-params";
import { COLUMNS_COOKIE_NAME } from "@/constants/storage";
import { setClientCookie } from "@/lib/client-cookies";
import { parsePageParam } from "@/lib/schemas/pagination";
import {
  type FeedSource,
  fetchFeedPage,
  getFeedQueryKey,
} from "@/lib/unsplash/feed";

import styles from "./PhotoFeed.module.scss";

interface PhotoFeedProps {
  source: FeedSource;
  initialColumns: ColumnCount;
  emptyMessage?: string;
}

export function PhotoFeed({
  source,
  initialColumns,
  emptyMessage = "No photos found",
}: PhotoFeedProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const page = parsePageParam(searchParams.get(PAGE_PARAM));
  const [columns, setColumns] = useState(initialColumns);

  const { data, isPending, isError, isPlaceholderData, refetch } = useQuery({
    queryKey: getFeedQueryKey(source, page),
    queryFn: () => fetchFeedPage(source, page),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    const prefetchPage = (targetPage: number) =>
      queryClient.prefetchQuery({
        queryKey: getFeedQueryKey(source, targetPage),
        queryFn: () => fetchFeedPage(source, targetPage),
      });

    if (page < data.totalPages) {
      void prefetchPage(page + 1);
    }

    if (page > DEFAULT_PAGE) {
      void prefetchPage(page - 1);
    }
  }, [data, page, queryClient, source]);

  const handleColumnsChange = (nextColumns: ColumnCount) => {
    setColumns(nextColumns);
    setClientCookie(COLUMNS_COOKIE_NAME, String(nextColumns));
  };

  const handlePageChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(PAGE_PARAM, String(nextPage));
    window.history.pushState(null, "", `${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0 });
  };

  return (
    <section className={styles.feed}>
      <div className={styles.toolbar}>
        <ColumnsToggle value={columns} onChange={handleColumnsChange} />
      </div>
      {isPending ? (
        <GallerySkeleton columns={columns} />
      ) : isError ? (
        <div className={styles.message} role="alert">
          <p>Something went wrong while loading photos.</p>
          <button
            type="button"
            className={styles.retryButton}
            onClick={() => refetch()}
          >
            Try again
          </button>
        </div>
      ) : data.photos.length === 0 ? (
        <div className={styles.message}>
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className={isPlaceholderData ? styles.refreshing : undefined}>
          <Gallery photos={data.photos} columns={columns} />
        </div>
      )}
      {data && data.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </section>
  );
}

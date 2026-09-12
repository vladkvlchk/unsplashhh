"use client";

import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";

import { ColumnsToggle } from "@/components/gallery/ColumnsToggle";
import { Gallery } from "@/components/gallery/Gallery";
import { GallerySkeleton } from "@/components/gallery/GallerySkeleton";
import { Pagination } from "@/components/gallery/Pagination";
import { DEFAULT_PAGE, RATE_LIMIT_STATUS_CODES } from "@/constants/api";
import { type ColumnCount } from "@/constants/layout";
import { useFeedPage } from "@/lib/hooks/use-feed-page";
import { useGalleryColumns } from "@/lib/hooks/use-gallery-columns";
import { HttpError } from "@/lib/unsplash/client";
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
  const queryClient = useQueryClient();
  const { page, goToPage } = useFeedPage();
  const { columns, changeColumns } = useGalleryColumns(initialColumns);

  const { data, error, isPending, isError, isPlaceholderData, refetch } =
    useQuery({
      queryKey: getFeedQueryKey(source, page),
      queryFn: () => fetchFeedPage(source, page),
      placeholderData: keepPreviousData,
    });

  const isRateLimited =
    error instanceof HttpError &&
    (RATE_LIMIT_STATUS_CODES as readonly number[]).includes(error.status);

  useEffect(() => {
    if (!data) {
      return;
    }

    const prefetchPage = (targetPage: number) =>
      queryClient
        .query({
          queryKey: getFeedQueryKey(source, targetPage),
          queryFn: () => fetchFeedPage(source, targetPage),
        })
        .catch(() => undefined);

    if (page < data.totalPages) {
      void prefetchPage(page + 1);
    }

    if (page > DEFAULT_PAGE) {
      void prefetchPage(page - 1);
    }
  }, [data, page, queryClient, source]);

  return (
    <section className={styles.feed}>
      <div className={styles.toolbar}>
        <ColumnsToggle value={columns} onChange={changeColumns} />
      </div>
      {isPending ? (
        <GallerySkeleton columns={columns} />
      ) : isError ? (
        <div className={styles.message} role="alert">
          <p>
            {isRateLimited
              ? "The Unsplash API hourly limit has been reached. Please try again in a few minutes."
              : "Something went wrong while loading photos."}
          </p>
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
          onPageChange={goToPage}
        />
      )}
    </section>
  );
}

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { cookies } from "next/headers";

import { FeedHeader } from "@/components/feed-header/FeedHeader";
import { PhotoFeed } from "@/components/gallery/PhotoFeed";
import { PAGE_PARAM } from "@/constants/search-params";
import { COLUMNS_COOKIE_NAME } from "@/constants/storage";
import { parseColumnCount } from "@/lib/columns";
import { capitalize, formatNumber } from "@/lib/format";
import { parsePageParam } from "@/lib/schemas/pagination";
import { prefetchSearchFeed } from "@/lib/unsplash/prefetch";

export async function generateMetadata({
  params,
}: PageProps<"/t/[tag]">): Promise<Metadata> {
  const { tag } = await params;
  const query = decodeURIComponent(tag);

  return {
    title: `${capitalize(query)} pictures`,
    description: `Browse photos tagged “${query}”, free to download.`,
  };
}

export default async function TagPage({
  params,
  searchParams,
}: PageProps<"/t/[tag]">) {
  const [{ tag }, search, cookieStore] = await Promise.all([
    params,
    searchParams,
    cookies(),
  ]);
  const query = decodeURIComponent(tag);
  const page = parsePageParam(search[PAGE_PARAM]);
  const columns = parseColumnCount(cookieStore.get(COLUMNS_COOKIE_NAME)?.value);
  const { queryClient, results } = await prefetchSearchFeed(query, page);

  return (
    <main className="container">
      <FeedHeader
        title={query}
        subtitle={
          results
            ? `${formatNumber(results.total)} photos tagged “${query}”`
            : undefined
        }
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PhotoFeed
          source={{ kind: "search", query }}
          initialColumns={columns}
          emptyMessage={`No photos found for “${query}”`}
        />
      </HydrationBoundary>
    </main>
  );
}

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { FeedHeader } from "@/components/feed-header/FeedHeader";
import { PhotoFeed } from "@/components/gallery/PhotoFeed";
import { ROUTES } from "@/constants/routes";
import { PAGE_PARAM, QUERY_PARAM } from "@/constants/search-params";
import { COLUMNS_COOKIE_NAME } from "@/constants/storage";
import { parseColumnCount } from "@/lib/columns";
import { capitalize, formatNumber } from "@/lib/format";
import { parsePageParam } from "@/lib/schemas/pagination";
import { searchFormSchema } from "@/lib/schemas/search";
import { prefetchSearchFeed } from "@/lib/unsplash/prefetch";

export async function generateMetadata({
  searchParams,
}: PageProps<"/search">): Promise<Metadata> {
  const params = await searchParams;
  const parsed = searchFormSchema.safeParse({ query: params[QUERY_PARAM] });

  return {
    title: parsed.success
      ? `${capitalize(parsed.data.query)} photos`
      : "Search photos",
  };
}

export default async function SearchPage({
  searchParams,
}: PageProps<"/search">) {
  const [params, cookieStore] = await Promise.all([searchParams, cookies()]);
  const parsed = searchFormSchema.safeParse({ query: params[QUERY_PARAM] });

  if (!parsed.success) {
    redirect(ROUTES.home);
  }

  const { query } = parsed.data;
  const page = parsePageParam(params[PAGE_PARAM]);
  const columns = parseColumnCount(cookieStore.get(COLUMNS_COOKIE_NAME)?.value);
  const { queryClient, results } = await prefetchSearchFeed(query, page);

  return (
    <main className="container">
      <FeedHeader
        title={query}
        subtitle={
          results ? `${formatNumber(results.total)} free photos` : undefined
        }
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PhotoFeed
          source={{ kind: "search", query }}
          initialColumns={columns}
          emptyMessage={`No results found for “${query}”`}
        />
      </HydrationBoundary>
    </main>
  );
}

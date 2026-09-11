import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";

import { PhotoFeed } from "@/components/gallery/PhotoFeed";
import { QUERY_KEYS } from "@/constants/query";
import { PAGE_PARAM } from "@/constants/search-params";
import { COLUMNS_COOKIE_NAME } from "@/constants/storage";
import { parseColumnCount } from "@/lib/columns";
import { parsePageParam } from "@/lib/schemas/pagination";
import { getPhotos } from "@/lib/unsplash/api";

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const [params, cookieStore] = await Promise.all([searchParams, cookies()]);
  const page = parsePageParam(params[PAGE_PARAM]);
  const columns = parseColumnCount(
    cookieStore.get(COLUMNS_COOKIE_NAME)?.value,
  );

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.photos(page),
    queryFn: () => getPhotos(page),
  });

  return (
    <main className="container">
      <h1 className="visually-hidden">Free high-resolution photos</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PhotoFeed source={{ kind: "editorial" }} initialColumns={columns} />
      </HydrationBoundary>
    </main>
  );
}

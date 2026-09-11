import { NextRequest, NextResponse } from "next/server";

import { PAGE_PARAM, QUERY_PARAM } from "@/constants/search-params";
import { toErrorResponse } from "@/lib/http";
import { parsePageParam } from "@/lib/schemas/pagination";
import { searchFormSchema } from "@/lib/schemas/search";
import { searchPhotos } from "@/lib/unsplash/api";

export async function GET(request: NextRequest) {
  const page = parsePageParam(request.nextUrl.searchParams.get(PAGE_PARAM));
  const parsedQuery = searchFormSchema.safeParse({
    query: request.nextUrl.searchParams.get(QUERY_PARAM),
  });

  if (!parsedQuery.success) {
    return NextResponse.json(
      { message: "Missing or invalid search query" },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json(await searchPhotos(parsedQuery.data.query, page));
  } catch (error) {
    return toErrorResponse(error);
  }
}

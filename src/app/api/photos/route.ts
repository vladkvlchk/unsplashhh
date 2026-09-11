import { NextRequest, NextResponse } from "next/server";

import { PAGE_PARAM } from "@/constants/search-params";
import { toErrorResponse } from "@/lib/http";
import { parsePageParam } from "@/lib/schemas/pagination";
import { getPhotos } from "@/lib/unsplash/api";

export async function GET(request: NextRequest) {
  const page = parsePageParam(request.nextUrl.searchParams.get(PAGE_PARAM));

  try {
    return NextResponse.json(await getPhotos(page));
  } catch (error) {
    return toErrorResponse(error);
  }
}

import { NextResponse } from "next/server";

import { UnsplashApiError } from "@/lib/unsplash/errors";

export function toErrorResponse(error: unknown): NextResponse {
  if (error instanceof UnsplashApiError) {
    return NextResponse.json(
      { message: error.message },
      { status: error.status },
    );
  }

  return NextResponse.json(
    { message: "Unexpected server error" },
    { status: 500 },
  );
}

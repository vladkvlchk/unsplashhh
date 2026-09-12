"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { PAGE_PARAM } from "@/constants/search-params";
import { parsePageParam } from "@/lib/schemas/pagination";

export function useFeedPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = parsePageParam(searchParams.get(PAGE_PARAM));

  const goToPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(PAGE_PARAM, String(nextPage));
    window.history.pushState(null, "", `${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0 });
  };

  return { page, goToPage };
}

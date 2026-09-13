"use client";

import { useSyncExternalStore } from "react";

import {
  BREAKPOINTS,
  type ColumnCount,
  MOBILE_COLUMN_COUNT,
  TABLET_COLUMN_MAP,
} from "@/constants/layout";

const MOBILE_QUERY = `(max-width: ${BREAKPOINTS.tablet - 1}px)`;
const TABLET_QUERY = `(max-width: ${BREAKPOINTS.laptop - 1}px)`;

function subscribe(onChange: () => void) {
  const mediaQueries = [MOBILE_QUERY, TABLET_QUERY].map((query) =>
    window.matchMedia(query),
  );

  for (const mediaQuery of mediaQueries) {
    mediaQuery.addEventListener("change", onChange);
  }

  return () => {
    for (const mediaQuery of mediaQueries) {
      mediaQuery.removeEventListener("change", onChange);
    }
  };
}

export function useEffectiveColumns(selectedColumns: ColumnCount): number {
  return useSyncExternalStore(
    subscribe,
    () => {
      if (window.matchMedia(MOBILE_QUERY).matches) {
        return MOBILE_COLUMN_COUNT;
      }

      if (window.matchMedia(TABLET_QUERY).matches) {
        return TABLET_COLUMN_MAP[selectedColumns];
      }

      return selectedColumns;
    },
    () => selectedColumns,
  );
}

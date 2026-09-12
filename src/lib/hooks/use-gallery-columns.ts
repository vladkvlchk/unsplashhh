"use client";

import { useState } from "react";

import { type ColumnCount } from "@/constants/layout";
import { COLUMNS_COOKIE_NAME } from "@/constants/storage";
import { setClientCookie } from "@/lib/client-cookies";

export function useGalleryColumns(initialColumns: ColumnCount) {
  const [columns, setColumns] = useState(initialColumns);

  const changeColumns = (nextColumns: ColumnCount) => {
    setColumns(nextColumns);
    setClientCookie(COLUMNS_COOKIE_NAME, String(nextColumns));
  };

  return { columns, changeColumns };
}

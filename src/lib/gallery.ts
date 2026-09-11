import {
  BREAKPOINTS,
  type ColumnCount,
  CONTAINER_MAX_WIDTH_PX,
  CONTAINER_PADDING_PX,
  TABLET_COLUMN_MAP,
} from "@/constants/layout";

export function getGallerySizes(columns: ColumnCount): string {
  const tabletVw = Math.round(100 / TABLET_COLUMN_MAP[columns]);
  const desktopVw = Math.round(100 / columns);
  const maxColumnWidth = Math.round(
    (CONTAINER_MAX_WIDTH_PX - CONTAINER_PADDING_PX * 2) / columns,
  );

  return [
    `(max-width: ${BREAKPOINTS.tablet - 1}px) 100vw`,
    `(max-width: ${BREAKPOINTS.laptop - 1}px) ${tabletVw}vw`,
    `(max-width: ${BREAKPOINTS.desktop - 1}px) ${desktopVw}vw`,
    `${maxColumnWidth}px`,
  ].join(", ");
}

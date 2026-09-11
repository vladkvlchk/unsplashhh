export const COLUMN_OPTIONS = [3, 5] as const;

export type ColumnCount = (typeof COLUMN_OPTIONS)[number];

export const DEFAULT_COLUMN_COUNT: ColumnCount = 3;

export const TABLET_COLUMN_MAP: Record<ColumnCount, number> = {
  3: 2,
  5: 3,
};

export const BREAKPOINTS = {
  mobile: 375,
  tablet: 768,
  laptop: 1024,
  desktop: 1440,
} as const;

export const CONTAINER_MAX_WIDTH_PX = BREAKPOINTS.desktop;
export const CONTAINER_PADDING_PX = 20;

export const PRIORITY_IMAGE_COUNT = 6;
export const AVATAR_SIZE_PX = 32;

export const PHOTO_PAGE_IMAGE_SIZES = `(max-width: ${BREAKPOINTS.laptop - 1}px) 100vw, 80vw`;

export const PROFILE_SKELETON_COUNT = 8;

export const SKELETON_ASPECT_RATIOS = [
  "3 / 4",
  "2 / 3",
  "1 / 1",
  "4 / 5",
  "3 / 2",
  "3 / 4",
  "4 / 3",
  "2 / 3",
] as const;

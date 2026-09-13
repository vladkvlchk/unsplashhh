import clsx from "clsx";

import { PHOTOS_PER_PAGE } from "@/constants/api";
import { type ColumnCount, SKELETON_ASPECT_RATIOS } from "@/constants/layout";

import styles from "./GallerySkeleton.module.scss";

interface GallerySkeletonProps {
  columns: ColumnCount;
  count?: number;
}

export function GallerySkeleton({
  columns,
  count = PHOTOS_PER_PAGE,
}: GallerySkeletonProps) {
  return (
    <ul
      className={clsx(styles.skeleton, styles[`columns${columns}`])}
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <li
          key={index}
          className={styles.item}
          style={{
            aspectRatio:
              SKELETON_ASPECT_RATIOS[index % SKELETON_ASPECT_RATIOS.length],
          }}
        />
      ))}
    </ul>
  );
}

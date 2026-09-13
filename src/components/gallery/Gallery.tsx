"use client";

import { memo, useMemo } from "react";

import { type ColumnCount, PRIORITY_ROWS_PER_COLUMN } from "@/constants/layout";
import { getGallerySizes } from "@/lib/gallery";
import { useEffectiveColumns } from "@/lib/hooks/use-effective-columns";
import { distributeIntoColumns } from "@/lib/masonry";
import type { UnsplashPhoto } from "@/types/unsplash";

import styles from "./Gallery.module.scss";
import { PhotoCard } from "./PhotoCard";

interface GalleryProps {
  photos: UnsplashPhoto[];
  columns: ColumnCount;
}

export const Gallery = memo(function Gallery({ photos, columns }: GalleryProps) {
  const effectiveColumns = useEffectiveColumns(columns);
  const sizes = getGallerySizes(columns);
  const photoColumns = useMemo(
    () => distributeIntoColumns(photos, effectiveColumns),
    [photos, effectiveColumns],
  );

  return (
    <div className={styles.gallery}>
      {photoColumns.map((columnPhotos, columnIndex) => (
        <ul key={columnIndex} className={styles.column}>
          {columnPhotos.map((photo, indexInColumn) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              sizes={sizes}
              priority={indexInColumn < PRIORITY_ROWS_PER_COLUMN}
            />
          ))}
        </ul>
      ))}
    </div>
  );
});

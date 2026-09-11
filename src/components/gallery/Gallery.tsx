"use client";

import clsx from "clsx";
import { memo } from "react";

import { type ColumnCount, PRIORITY_ROWS_PER_COLUMN } from "@/constants/layout";
import { getGallerySizes } from "@/lib/gallery";
import type { UnsplashPhoto } from "@/types/unsplash";

import styles from "./Gallery.module.scss";
import { PhotoCard } from "./PhotoCard";

interface GalleryProps {
  photos: UnsplashPhoto[];
  columns: ColumnCount;
}

export const Gallery = memo(function Gallery({ photos, columns }: GalleryProps) {
  const sizes = getGallerySizes(columns);
  const photosPerColumn = Math.ceil(photos.length / columns);

  return (
    <ul className={clsx(styles.gallery, styles[`columns${columns}`])}>
      {photos.map((photo, index) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          sizes={sizes}
          priority={index % photosPerColumn < PRIORITY_ROWS_PER_COLUMN}
        />
      ))}
    </ul>
  );
});

"use client";

import clsx from "clsx";
import { memo } from "react";

import { type ColumnCount, PRIORITY_IMAGE_COUNT } from "@/constants/layout";
import { getGallerySizes } from "@/lib/gallery";
import type { UnsplashPhoto } from "@/types/unsplash";

import styles from "./Gallery.module.scss";
import { PhotoCard } from "./PhotoCard";

interface GalleryProps {
  photos: UnsplashPhoto[];
  columns: ColumnCount;
  eagerCount?: number;
}

export const Gallery = memo(function Gallery({
  photos,
  columns,
  eagerCount = PRIORITY_IMAGE_COUNT,
}: GalleryProps) {
  const sizes = getGallerySizes(columns);

  return (
    <ul className={clsx(styles.gallery, styles[`columns${columns}`])}>
      {photos.map((photo, index) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          sizes={sizes}
          priority={index < eagerCount}
        />
      ))}
    </ul>
  );
});

"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

import { AVATAR_SIZE_PX } from "@/constants/layout";
import { ROUTES } from "@/constants/routes";
import type { UnsplashPhoto } from "@/types/unsplash";

import styles from "./PhotoCard.module.scss";

interface PhotoCardProps {
  photo: UnsplashPhoto;
  sizes: string;
  priority?: boolean;
}

export function getPhotoAlt(photo: UnsplashPhoto): string {
  return (
    photo.alt_description ??
    photo.description ??
    `Photo by ${photo.user.name}`
  );
}

function markLoaded(image: HTMLImageElement) {
  image.removeAttribute("data-pending");
}

function trackImageLoading(image: HTMLImageElement | null) {
  if (!image || image.complete) {
    return;
  }

  image.setAttribute("data-pending", "");
}

export const PhotoCard = memo(function PhotoCard({
  photo,
  sizes,
  priority = false,
}: PhotoCardProps) {
  return (
    <li className={styles.card}>
      <Link
        href={ROUTES.photo(photo.id)}
        className={styles.link}
        aria-label={getPhotoAlt(photo)}
      >
        <Image
          ref={trackImageLoading}
          src={photo.urls.raw}
          alt={getPhotoAlt(photo)}
          width={photo.width}
          height={photo.height}
          sizes={sizes}
          priority={priority}
          className={styles.image}
          style={{ backgroundColor: photo.color ?? undefined }}
          onLoad={(event) => markLoaded(event.currentTarget)}
        />
        <span className={styles.overlay}>
          <span className={styles.author}>
            <Image
              src={photo.user.profile_image.medium}
              alt=""
              width={AVATAR_SIZE_PX}
              height={AVATAR_SIZE_PX}
              className={styles.avatar}
            />
            <span className={styles.authorName}>{photo.user.name}</span>
          </span>
        </span>
      </Link>
    </li>
  );
});

import clsx from "clsx";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { HeartIcon } from "@/components/icons/icons";
import { AVATAR_SIZE_PX, PHOTO_PAGE_IMAGE_SIZES } from "@/constants/layout";
import { ROUTES } from "@/constants/routes";
import {
  META_DESCRIPTION_MAX_LENGTH,
  PHOTO_TITLE_MAX_LENGTH,
} from "@/constants/seo";
import { capitalize, formatDate, formatNumber, truncate } from "@/lib/format";
import { getPhoto } from "@/lib/unsplash/api";
import { isNotFoundError } from "@/lib/unsplash/errors";
import type { UnsplashPhotoDetails } from "@/types/unsplash";

import styles from "./page.module.scss";

async function getPhotoOrNotFound(id: string): Promise<UnsplashPhotoDetails> {
  try {
    return await getPhoto(id);
  } catch (error) {
    if (isNotFoundError(error)) {
      notFound();
    }

    throw error;
  }
}

function getPhotoTitle(photo: UnsplashPhotoDetails): string {
  return (
    photo.description ??
    photo.alt_description ??
    `Photo by ${photo.user.name}`
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/photos/[id]">): Promise<Metadata> {
  const { id } = await params;
  const photo = await getPhotoOrNotFound(id);
  const title = truncate(capitalize(getPhotoTitle(photo)), PHOTO_TITLE_MAX_LENGTH);

  return {
    title,
    description: truncate(
      `Photo by ${photo.user.name} on Unsplash: ${getPhotoTitle(photo)}`,
      META_DESCRIPTION_MAX_LENGTH,
    ),
    openGraph: {
      images: [photo.urls.regular],
    },
  };
}

export default async function PhotoPage({ params }: PageProps<"/photos/[id]">) {
  const { id } = await params;
  const photo = await getPhotoOrNotFound(id);
  const alt = getPhotoTitle(photo);

  return (
    <main className={clsx("container", styles.page)}>
      <div className={styles.topBar}>
        <div className={styles.author}>
          <Image
            src={photo.user.profile_image.medium}
            alt=""
            width={AVATAR_SIZE_PX}
            height={AVATAR_SIZE_PX}
            className={styles.avatar}
          />
          <div>
            <p className={styles.authorName}>{photo.user.name}</p>
            <p className={styles.authorUsername}>@{photo.user.username}</p>
          </div>
        </div>
        <div className={styles.likes} title="Likes">
          <HeartIcon />
          <span>{formatNumber(photo.likes)}</span>
        </div>
      </div>
      <figure className={styles.figure}>
        <Image
          src={photo.urls.raw}
          alt={alt}
          width={photo.width}
          height={photo.height}
          sizes={PHOTO_PAGE_IMAGE_SIZES}
          priority
          className={styles.photo}
          style={{ backgroundColor: photo.color ?? undefined }}
        />
      </figure>
      <section className={styles.details}>
        {photo.description && (
          <p className={styles.description}>{capitalize(photo.description)}</p>
        )}
        <dl className={styles.stats}>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>Published</dt>
            <dd className={styles.statValue}>{formatDate(photo.created_at)}</dd>
          </div>
          {typeof photo.views === "number" && (
            <div className={styles.stat}>
              <dt className={styles.statLabel}>Views</dt>
              <dd className={styles.statValue}>{formatNumber(photo.views)}</dd>
            </div>
          )}
          {typeof photo.downloads === "number" && (
            <div className={styles.stat}>
              <dt className={styles.statLabel}>Downloads</dt>
              <dd className={styles.statValue}>
                {formatNumber(photo.downloads)}
              </dd>
            </div>
          )}
          {photo.location?.name && (
            <div className={styles.stat}>
              <dt className={styles.statLabel}>Location</dt>
              <dd className={styles.statValue}>{photo.location.name}</dd>
            </div>
          )}
        </dl>
        {photo.tags.length > 0 && (
          <>
            <h2 className={styles.tagsTitle}>Related tags</h2>
            <ul className={styles.tags}>
              {photo.tags.map((tag) => (
                <li key={tag.title}>
                  <Link href={ROUTES.tag(tag.title)} className={styles.tag}>
                    {tag.title}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </main>
  );
}

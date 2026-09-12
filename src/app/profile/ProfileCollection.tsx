"use client";

import Link from "next/link";

import { ColumnsToggle } from "@/components/gallery/ColumnsToggle";
import { Gallery } from "@/components/gallery/Gallery";
import { GallerySkeleton } from "@/components/gallery/GallerySkeleton";
import { type ColumnCount, PROFILE_SKELETON_COUNT } from "@/constants/layout";
import { ROUTES } from "@/constants/routes";
import { useCollection } from "@/lib/collection/hooks";
import { useGalleryColumns } from "@/lib/hooks/use-gallery-columns";
import { useHydrated } from "@/lib/hooks/use-hydrated";

import styles from "./ProfileCollection.module.scss";

interface ProfileCollectionProps {
  initialColumns: ColumnCount;
}

export function ProfileCollection({ initialColumns }: ProfileCollectionProps) {
  const hydrated = useHydrated();
  const photos = useCollection();
  const { columns, changeColumns } = useGalleryColumns(initialColumns);

  if (!hydrated) {
    return (
      <GallerySkeleton columns={initialColumns} count={PROFILE_SKELETON_COUNT} />
    );
  }

  if (photos.length === 0) {
    return (
      <div className={styles.empty}>
        <p>You have not saved any photos yet.</p>
        <Link href={ROUTES.home} className={styles.browseLink}>
          Browse photos
        </Link>
      </div>
    );
  }

  return (
    <section>
      <div className={styles.toolbar}>
        <ColumnsToggle value={columns} onChange={changeColumns} />
      </div>
      <Gallery photos={photos} columns={columns} />
    </section>
  );
}

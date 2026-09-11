"use client";

import Link from "next/link";
import { useState } from "react";

import { ColumnsToggle } from "@/components/gallery/ColumnsToggle";
import { Gallery } from "@/components/gallery/Gallery";
import { GallerySkeleton } from "@/components/gallery/GallerySkeleton";
import { type ColumnCount, PROFILE_SKELETON_COUNT } from "@/constants/layout";
import { ROUTES } from "@/constants/routes";
import { COLUMNS_COOKIE_NAME } from "@/constants/storage";
import { setClientCookie } from "@/lib/client-cookies";
import { useCollection } from "@/lib/collection/hooks";
import { useHydrated } from "@/lib/hooks/use-hydrated";

import styles from "./ProfileCollection.module.scss";

interface ProfileCollectionProps {
  initialColumns: ColumnCount;
}

export function ProfileCollection({ initialColumns }: ProfileCollectionProps) {
  const hydrated = useHydrated();
  const photos = useCollection();
  const [columns, setColumns] = useState(initialColumns);

  const handleColumnsChange = (nextColumns: ColumnCount) => {
    setColumns(nextColumns);
    setClientCookie(COLUMNS_COOKIE_NAME, String(nextColumns));
  };

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
        <ColumnsToggle value={columns} onChange={handleColumnsChange} />
      </div>
      <Gallery photos={photos} columns={columns} />
    </section>
  );
}

"use client";

import clsx from "clsx";

import { BookmarkIcon } from "@/components/icons/icons";
import { useIsSaved } from "@/lib/collection/hooks";
import { collectionStore } from "@/lib/collection/store";
import type { UnsplashPhoto } from "@/types/unsplash";

import styles from "./SavePhotoButton.module.scss";

interface SavePhotoButtonProps {
  photo: UnsplashPhoto;
  appearance?: "icon" | "labeled";
  className?: string;
}

export function SavePhotoButton({
  photo,
  appearance = "icon",
  className,
}: SavePhotoButtonProps) {
  const isSaved = useIsSaved(photo.id);
  const label = isSaved ? "Remove from collection" : "Save to collection";

  return (
    <button
      type="button"
      className={clsx(
        styles.button,
        styles[appearance],
        isSaved && styles.saved,
        className,
      )}
      aria-label={label}
      aria-pressed={isSaved}
      title={label}
      onClick={() => collectionStore.toggle(photo)}
    >
      <BookmarkIcon filled={isSaved} />
      {appearance === "labeled" && (
        <span>{isSaved ? "Saved" : "Save"}</span>
      )}
    </button>
  );
}

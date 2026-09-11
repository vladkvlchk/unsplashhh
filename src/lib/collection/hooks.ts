"use client";

import { useSyncExternalStore } from "react";

import { collectionStore } from "@/lib/collection/store";
import type { UnsplashPhoto } from "@/types/unsplash";

export function useCollection(): UnsplashPhoto[] {
  return useSyncExternalStore(
    collectionStore.subscribe,
    collectionStore.getSnapshot,
    collectionStore.getServerSnapshot,
  );
}

export function useIsSaved(photoId: string): boolean {
  return useSyncExternalStore(
    collectionStore.subscribe,
    () => collectionStore.has(photoId),
    () => false,
  );
}

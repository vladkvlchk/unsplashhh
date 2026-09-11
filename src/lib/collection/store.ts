import { COLLECTION_STORAGE_KEY } from "@/constants/storage";
import type { UnsplashPhoto } from "@/types/unsplash";

type Listener = () => void;

const EMPTY_COLLECTION: UnsplashPhoto[] = [];

let cache: UnsplashPhoto[] | null = null;
const listeners = new Set<Listener>();

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

function handleStorageEvent(event: StorageEvent) {
  if (event.key === COLLECTION_STORAGE_KEY) {
    cache = null;
    notify();
  }
}

function read(): UnsplashPhoto[] {
  if (cache) {
    return cache;
  }

  try {
    const stored = localStorage.getItem(COLLECTION_STORAGE_KEY);
    cache = stored ? (JSON.parse(stored) as UnsplashPhoto[]) : EMPTY_COLLECTION;
  } catch {
    cache = EMPTY_COLLECTION;
  }

  return cache;
}

function write(photos: UnsplashPhoto[]) {
  cache = photos;

  try {
    localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify(photos));
  } catch {
    // Storage may be unavailable (private mode, quota); keep in-memory state.
  }

  notify();
}

export const collectionStore = {
  subscribe(listener: Listener): () => void {
    if (listeners.size === 0) {
      window.addEventListener("storage", handleStorageEvent);
    }

    listeners.add(listener);

    return () => {
      listeners.delete(listener);

      if (listeners.size === 0) {
        window.removeEventListener("storage", handleStorageEvent);
      }
    };
  },

  getSnapshot(): UnsplashPhoto[] {
    return read();
  },

  getServerSnapshot(): UnsplashPhoto[] {
    return EMPTY_COLLECTION;
  },

  has(id: string): boolean {
    return read().some((photo) => photo.id === id);
  },

  toggle(photo: UnsplashPhoto): void {
    const current = read();
    const exists = current.some((item) => item.id === photo.id);

    write(
      exists
        ? current.filter((item) => item.id !== photo.id)
        : [photo, ...current],
    );
  },
};

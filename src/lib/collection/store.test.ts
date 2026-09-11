import { beforeEach, describe, expect, it, vi } from "vitest";

import { COLLECTION_STORAGE_KEY } from "@/constants/storage";
import { makePhoto } from "@/test/fixtures";

type CollectionStore =
  typeof import("@/lib/collection/store").collectionStore;

let collectionStore: CollectionStore;

beforeEach(async () => {
  vi.resetModules();
  localStorage.clear();
  ({ collectionStore } = await import("@/lib/collection/store"));
});

describe("collectionStore", () => {
  it("starts empty", () => {
    expect(collectionStore.getSnapshot()).toEqual([]);
    expect(collectionStore.getServerSnapshot()).toEqual([]);
  });

  it("returns a stable snapshot between reads", () => {
    expect(collectionStore.getSnapshot()).toBe(collectionStore.getSnapshot());
  });

  it("saves a photo, newest first", () => {
    const first = makePhoto("first");
    const second = makePhoto("second");

    collectionStore.toggle(first);
    collectionStore.toggle(second);

    expect(collectionStore.has("first")).toBe(true);
    expect(collectionStore.getSnapshot().map((photo) => photo.id)).toEqual([
      "second",
      "first",
    ]);
  });

  it("removes a photo on the second toggle", () => {
    const photo = makePhoto("first");

    collectionStore.toggle(photo);
    collectionStore.toggle(photo);

    expect(collectionStore.has("first")).toBe(false);
    expect(collectionStore.getSnapshot()).toEqual([]);
  });

  it("persists the collection to localStorage", () => {
    collectionStore.toggle(makePhoto("first"));

    const stored = JSON.parse(
      localStorage.getItem(COLLECTION_STORAGE_KEY) ?? "[]",
    );

    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe("first");
  });

  it("notifies subscribers on changes and stops after unsubscribe", () => {
    const listener = vi.fn();
    const unsubscribe = collectionStore.subscribe(listener);

    collectionStore.toggle(makePhoto("first"));
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    collectionStore.toggle(makePhoto("second"));
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("picks up changes written by another tab via the storage event", () => {
    const listener = vi.fn();
    collectionStore.subscribe(listener);

    localStorage.setItem(
      COLLECTION_STORAGE_KEY,
      JSON.stringify([makePhoto("from-other-tab")]),
    );
    window.dispatchEvent(
      new StorageEvent("storage", { key: COLLECTION_STORAGE_KEY }),
    );

    expect(listener).toHaveBeenCalledTimes(1);
    expect(collectionStore.has("from-other-tab")).toBe(true);
  });

  it("ignores storage events for unrelated keys", () => {
    const listener = vi.fn();
    collectionStore.subscribe(listener);

    window.dispatchEvent(new StorageEvent("storage", { key: "other-key" }));

    expect(listener).not.toHaveBeenCalled();
  });

  it("recovers from corrupted stored data", () => {
    localStorage.setItem(COLLECTION_STORAGE_KEY, "{not valid json");

    expect(collectionStore.getSnapshot()).toEqual([]);
  });
});

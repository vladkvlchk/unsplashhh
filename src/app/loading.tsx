import { GallerySkeleton } from "@/components/gallery/GallerySkeleton";
import { DEFAULT_COLUMN_COUNT } from "@/constants/layout";

import styles from "./loading.module.scss";

export default function HomeLoading() {
  return (
    <main className="container">
      <div className={styles.toolbarPlaceholder} />
      <GallerySkeleton columns={DEFAULT_COLUMN_COUNT} />
    </main>
  );
}

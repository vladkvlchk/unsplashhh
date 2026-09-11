import Link from "next/link";

import { ROUTES } from "@/constants/routes";

import styles from "./error.module.scss";

export default function NotFoundPage() {
  return (
    <main className={`container ${styles.error}`}>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.text}>
        The page you are looking for does not exist or has been removed.
      </p>
      <Link href={ROUTES.home} className={styles.button}>
        Back to gallery
      </Link>
    </main>
  );
}

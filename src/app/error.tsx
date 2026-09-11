"use client";

import styles from "./error.module.scss";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className={`container ${styles.error}`}>
      <h1 className={styles.title}>Something went wrong</h1>
      <p className={styles.text}>
        An unexpected error occurred. Please try again.
      </p>
      <button type="button" className={styles.button} onClick={reset}>
        Try again
      </button>
    </main>
  );
}

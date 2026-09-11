import styles from "./loading.module.scss";

export default function PhotoLoading() {
  return (
    <main className="container">
      <div className={styles.topBar} />
      <div className={styles.photo} />
    </main>
  );
}

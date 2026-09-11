import styles from "./FeedHeader.module.scss";

interface FeedHeaderProps {
  title: string;
  subtitle?: string;
}

export function FeedHeader({ title, subtitle }: FeedHeaderProps) {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}

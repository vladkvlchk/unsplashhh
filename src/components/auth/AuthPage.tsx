import clsx from "clsx";
import type { ReactNode } from "react";

import styles from "./AuthPage.module.scss";

interface AuthPageProps {
  title: string;
  subtitle: string;
  footer: ReactNode;
  children: ReactNode;
}

export function AuthPage({ title, subtitle, footer, children }: AuthPageProps) {
  return (
    <main className={clsx("container", styles.page)}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
      {children}
      <p className={styles.footer}>{footer}</p>
    </main>
  );
}

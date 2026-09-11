import Link from "next/link";
import { Suspense } from "react";

import { SearchForm } from "@/components/header/SearchForm";
import { LogoIcon } from "@/components/icons/icons";
import { APP_NAME } from "@/constants/app";
import { ROUTES } from "@/constants/routes";

import styles from "./Header.module.scss";

export function Header() {
  return (
    <header className={styles.header}>
      <Link
        href={ROUTES.home}
        className={styles.logo}
        aria-label={`${APP_NAME} home`}
      >
        <LogoIcon />
        <span className={styles.logoText}>{APP_NAME}</span>
      </Link>
      <Suspense fallback={null}>
        <SearchForm />
      </Suspense>
      <nav className={styles.nav}>
        <Link href={ROUTES.register} className={styles.joinButton}>
          Join
        </Link>
      </nav>
    </header>
  );
}

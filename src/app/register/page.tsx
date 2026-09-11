import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { RegisterForm } from "@/app/register/RegisterForm";
import { APP_NAME } from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import { getSession } from "@/lib/session";

import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "Join",
};

export default async function RegisterPage() {
  const session = await getSession();

  if (session) {
    redirect(ROUTES.profile);
  }

  return (
    <main className={`container ${styles.page}`}>
      <h1 className={styles.title}>Join {APP_NAME}</h1>
      <p className={styles.subtitle}>
        Create an account to save photos to your collection.
      </p>
      <RegisterForm />
    </main>
  );
}

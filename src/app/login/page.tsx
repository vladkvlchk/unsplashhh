import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthPage } from "@/components/auth/AuthPage";
import { LoginForm } from "@/components/auth/LoginForm";
import { APP_NAME } from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Log in",
};

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect(ROUTES.profile);
  }

  return (
    <AuthPage
      title={`Log in to ${APP_NAME}`}
      subtitle="Welcome back! Enter your account details."
      footer={
        <>
          New to {APP_NAME}? <Link href={ROUTES.register}>Join</Link>
        </>
      }
    >
      <LoginForm />
    </AuthPage>
  );
}

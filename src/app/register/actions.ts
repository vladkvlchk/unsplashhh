"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import {
  COOKIE_MAX_AGE_SECONDS,
  SESSION_COOKIE_NAME,
} from "@/constants/storage";
import {
  type RegisterFormValues,
  registerFormSchema,
} from "@/lib/schemas/register";

export async function registerUser(
  values: RegisterFormValues,
): Promise<{ error: string } | void> {
  const parsed = registerFormSchema.safeParse(values);

  if (!parsed.success) {
    return { error: "Please check the entered data and try again" };
  }

  const { name, email } = parsed.data;
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify({ name, email }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });

  redirect(ROUTES.home);
}

export async function logoutUser(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);

  redirect(ROUTES.home);
}

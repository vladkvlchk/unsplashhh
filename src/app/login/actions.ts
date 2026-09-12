"use server";

import { redirect } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import { verifyPassword } from "@/lib/auth/passwords";
import { setSession } from "@/lib/auth/session";
import { findUserByEmail } from "@/lib/auth/users";
import { type LoginFormValues, loginFormSchema } from "@/lib/schemas/login";

export async function loginUser(
  values: LoginFormValues,
): Promise<{ error: string } | void> {
  const parsed = loginFormSchema.safeParse(values);

  if (!parsed.success) {
    return { error: "Please check the entered data and try again" };
  }

  const email = parsed.data.email.toLowerCase();
  const user = await findUserByEmail(email);

  if (!user || !verifyPassword(parsed.data.password, user.salt, user.passwordHash)) {
    return { error: "Invalid email or password" };
  }

  await setSession({ name: user.name, email: user.email });

  redirect(ROUTES.home);
}

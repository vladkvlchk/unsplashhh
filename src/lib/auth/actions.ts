"use server";

import { redirect } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import { createSalt, hashPassword, verifyPassword } from "@/lib/auth/passwords";
import { clearSession, setSession } from "@/lib/auth/session";
import { findUserByEmail, persistUsers, readUsers } from "@/lib/auth/users";
import { type LoginFormValues, loginFormSchema } from "@/lib/schemas/login";
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

  const { name, password } = parsed.data;
  const email = parsed.data.email.toLowerCase();

  if (await findUserByEmail(email)) {
    return { error: "An account with this email already exists" };
  }

  const salt = createSalt();
  const users = await readUsers();

  await persistUsers([
    ...users,
    { email, name, salt, passwordHash: hashPassword(password, salt) },
  ]);
  await setSession({ name, email });

  redirect(ROUTES.home);
}

export async function loginUser(
  values: LoginFormValues,
): Promise<{ error: string } | void> {
  const parsed = loginFormSchema.safeParse(values);

  if (!parsed.success) {
    return { error: "Please check the entered data and try again" };
  }

  const email = parsed.data.email.toLowerCase();
  const user = await findUserByEmail(email);

  if (
    !user ||
    !verifyPassword(parsed.data.password, user.salt, user.passwordHash)
  ) {
    return { error: "Invalid email or password" };
  }

  await setSession({ name: user.name, email: user.email });

  redirect(ROUTES.home);
}

export async function logoutUser(): Promise<void> {
  await clearSession();

  redirect(ROUTES.home);
}

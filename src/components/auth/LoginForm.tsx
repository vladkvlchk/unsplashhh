"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { loginUser } from "@/app/login/actions";
import { type LoginFormValues, loginFormSchema } from "@/lib/schemas/login";

import styles from "./AuthForm.module.scss";

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    const result = await loginUser(values);

    if (result?.error) {
      setServerError(result.error);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input
          {...register("email")}
          id="email"
          className={styles.input}
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email && (
          <p className={styles.fieldError}>{errors.email.message}</p>
        )}
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <input
          {...register("password")}
          id="password"
          className={styles.input}
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
        />
        {errors.password && (
          <p className={styles.fieldError}>{errors.password.message}</p>
        )}
      </div>
      {serverError && (
        <p className={styles.serverError} role="alert">
          {serverError}
        </p>
      )}
      <button type="submit" className={styles.submit} disabled={isSubmitting}>
        {isSubmitting ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}
